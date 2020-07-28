/**
 * 产品对比功能包
 * @package product compare
 * @author wiki <2009-10-22>
 * @since 2.0
 */

ZOL.widget = ZOL.widget || {};

ZOL.widget.compare = {
	//远程AJAX请求URL
	requestUrl: '/index.php?c=Ajax&a=Compare&proIdStr=',

	postUrl: '/ProductComp_param_{PARAM}.html',

	buttons: [{
		value: '进行对比',
		id: 'comp-submit-btn',
		type: 'submit',
		callback: function () {
			self.postUrl = '/ProductComp_param_{PARAM}.html';
		}
	}],

	initItem: function (obj) {
		obj.onmouseover = function () {
			obj.className = 'over';
			obj.getElementsByTagName('a')[0].style.display = 'block';
		}
		obj.onmouseout = function () {
			obj.className = '';
			obj.getElementsByTagName('a')[0].style.display = 'none';
		}
	},

	init: function (subcateId) {
		if (!subcateId) {
			subcateId = 0;
		}
		this.subcateId = subcateId;

		this.cookie = ZOL.util.cookie;
		this.cookieName = 'comp_pro_' + this.subcateId;

		var proIdStr = this.cookie.get(this.cookieName);

		this.createBox('comp_box');
		this.counter = this.counterContainer.innerHTML = 0;
		this.lastSubcateId = 0; //标记最后一次插入的产品SUBID

		this.proArr = {};
		this.hasOnBeforeUnload = ('onbeforeunload' in window);
		this.hasOnBeforeUnload = false;
		//通过AJAX初始化对比产品
		this.loadItems(proIdStr);
	},

	// 创建数据对比的侧边栏
	createBox: function (compId) {
		var self = this;
		var compBox = ZOL.$(compId);
		if (compBox) {
			this.compBox = compBox;
			this.compForm = this.compBox.getElementsByTagName('form')[0];
			this.compTop = ZOL.$('comp_top');
			this.subcateIdObj = ZOL.$('subid_obj');
			this.compInfo = this.compTop.getElementsByTagName('span')[0];
			this.counterContainer = ZOL.$('comp_num');
			this.itemContainer = ZOL.$('comp_items');
			this.compBoot = ZOL.$('comp_boot');
		} else {
			this.compBox = document.createElement('div');

			this.compBox.id = compId;

			this.compForm = document.createElement('form');
			with(this.compForm) {
				action = '';
				method = 'post';
				target = "_blank";
				onsubmit = function () {
					return self.exec()
				};
			}

			this.compTop = document.createElement('div');
			this.compTop.id = 'comp_top';
			var compBoxName = document.createTextNode('对比栏');
			var compInfo = document.createElement('span');
			var leftMb = document.createTextNode('[');
			var limitSubIdArr = ["57", "16", "15"];
			var addLimitNum = ($.inArray(subcateId, limitSubIdArr) !== -1) ? 5 : 4;
			var rightMbStr = '/' + addLimitNum + ']';
			var rightMb = document.createTextNode(rightMbStr);
			this.counterContainer = document.createElement('b');
			this.counterContainer.id = 'comp_num';
			this.closeBtn = document.createElement('a');
			// //with(this.closeBtn) {
			// this.closeBtn.className = 'close';
			// this.closeBtn.href = "javascript:ZOL.widget.compare.hidden();";
			// this.closeBtn.appendChild(document.createTextNode(' '));
			// this.closeBtn.target = '_self';
			// //}

			with(this.closeBtn) {
				this.closeBtn.className = 'close';
				this.closeBtn.href = "javascript:ZOL.widget.compare.hidden();";
				this.closeBtn.appendChild(document.createTextNode(' '));
				this.closeBtn.target = '_self';
			}
			var compTopL = document.createElement('div');
			compTopL.className = 'top_l';
			compTopL.appendChild(compBoxName);
			compTopL.appendChild(leftMb);
			compTopL.appendChild(this.counterContainer);
			compTopL.appendChild(rightMb);
			compTopL.appendChild(compBoxName);

			this.compTop.appendChild(compTopL);
			this.compTop.appendChild(this.closeBtn);

			this.itemContainer = document.createElement('ul');
			this.itemContainer.id = 'comp_items';
			this.compBoot = document.createElement('div');
			with(this.compBoot) {
				id = 'comp_boot';
				style = "text-align: center";
				innerHTML = [
					'    <a href="javascript:ZOL.widget.compare.removeAll()" target="_self">清空对比栏</a>',
				].join('\r\n');
			}

			this.btnCon = document.createElement('div');
			ZOL.each(this.buttons, function (btn) {
				if (!btn) {
					return false;
				}

				var _btnObj = document.createElement('input');
				_btnObj.type = btn.type;
				typeof (btn.callback) == 'function' && (_btnObj.onclick = btn.callback);
				self.btnCon.appendChild(_btnObj);
				_btnObj.id = btn.id;
				_btnObj.value = btn.value;
			});
			this.btnCon.id = 'comp_btn_con';

			this.subcateIdObj = document.createElement('input');
			with(this.subcateIdObj) {
				id = 'subid_obj';
				value = this.subcatid;
				name = 'subcatid';
				type = 'hidden';
			}
			this.compBoot.appendChild(this.subcateIdObj);
			this.compForm.appendChild(this.compTop);
			this.compForm.appendChild(this.itemContainer);
			this.compForm.appendChild(this.btnCon);
			this.compForm.appendChild(this.compBoot);
			this.compBox.appendChild(this.compForm);
			document.body.appendChild(this.compBox);
		}
		this.subcateIdObj.value = this.subcateId;
	},

	// 删除所有对比产品
	removeAll: function () {
		var items = this.itemContainer.getElementsByTagName('li');
		var itemsNum = items.length;
		var proIdArr = [];
		if (itemsNum) {
			for (var k = 0; k < itemsNum; k++) {
				proIdArr[k] = items[k].id.substr(3);
			}
			for (var i = 0; i < proIdArr.length; i++) {
				var _proId = proIdArr[i];
				this.remove(_proId);
			}
		}
		if (this.removeAllOnly) {
			lastCompSubId = 0;
		}
	},

	// 删除单个侧边栏产品
	remove: function (_proId) {
		var checkbox = ZOL.$('proId_' + _proId);
		var cpId = 'cp_' + _proId;
		var remvoeItem = ZOL.$(cpId);
		delete ZOL.widget.compare.proArr[_proId];
		this.itemContainer.removeChild(remvoeItem);
		this.counter--;
		this.counterContainer.innerHTML--;
		if (checkbox) {
			checkbox.checked = false;
			checkbox.setAttribute('choose', 'false');
			checkbox.value = _proId;
			checkbox.className = 'compare-btn';
		}
		if (this.counter <= 0) {
			this.hidden();
		}
		this.hasOnBeforeUnload || this.destruct(); //不支持onbeforeunload事件的话，现在就处理COOKIE
	},

	loadItems: function (proIdStr) {
		var self = this;
		var url = self.requestUrl + proIdStr;
		var A = new ZOL.util.AJAX();
		A.get(
			url,
			function (data) {
				if (data) {
					var proArr = eval('(' + data + ')');
					for (var _proId in proArr) {
						var proName = proArr[_proId].NAME;
						var url = proArr[_proId].URL;
						var pic = proArr[_proId].PIC;
						var subcateId = proArr[_proId].SUBID;
						self.addItem(_proId, proName, url, pic, subcateId);
					}
				}
			}
		);
	},

	addItem: function (_proId, proName, url, pic, subcateId) {
		if (this.lastSubcateId && subcateId != this.lastSubcateId) {
			this.subcateIdObj.value = this.subcateId;
			this.removeAllOnly = false;
			this.removeAll();
			this.removeAllOnly = true;
		}
		this.lastSubcateId = subcateId;
		if (this.proArr[_proId]) return;
		var thisItem = document.createElement('li');
		with(thisItem) {
			id = 'cp_' + _proId;
			innerHTML = [
				'      <a class="icon" href="javascript:ZOL.widget.compare.remove(\'' + _proId + '\');" target="_self">x</a>',
				'      <p class="img"><a href="' + url + '" title="' + proName + '" target="_blank"><img src="' + pic + ' " /></a></p>',
				'      <p class="title"><a href="' + url + '" title="' + proName + '" target="_blank">' + proName + '</a></p>',
				'      <input type="hidden" name="pro_id[]" value="' + _proId + '">'
			].join('\r\n');
		}
		this.proArr[_proId] = true; //缓存产品
		this.initItem(thisItem);
		this.counter++;
		this.counterContainer.innerHTML++;
		this.itemContainer.appendChild(thisItem);
		var proObj = ZOL.$('proId_' + _proId);
		if (proObj && !proObj.checked) {
			proObj.checked = true;
		}


		//渐变效果
		new ZOL.load('http://icon.zol-img.com.cn/products/js/util/effect.js', 'js', function () {
			var fade = ZOL.widget.effect && ZOL.widget.effect.fade;
			fade && new fade(thisItem);
		});
		this.hasOnBeforeUnload || this.destruct(); //不支持onbeforeunload事件的话，现在就处理COOKIE
		return thisItem;
	},

	hidden: function () {
		this.compBox.style.display = 'none';
	},

	show: function () {
		this.compBox.style.display = 'block';
	},

	sortProId: function () {
		var proJoin = [];
		if (this.proArr) {
			for (k in this.proArr) {
				proJoin.push(k);
			}
			return proJoin.sort(function compare(a, b) {
				return a - b;
			});
		}
		return false;
	},

	destruct: function () {
		var proIdArr = this.sortProId();
		if (!proIdArr) {
			return false;
		}
		var proStr = proIdArr.join(',');
		this.cookie.set(this.cookieName, proStr);
	},

	exec: function () {
		if (this.counter == 0) {
			alert('请先选择要对比的产品~');
			return false;
		}
		var limitSubIdArr = ["57", "16", "15"];
		var addLimitNum = 100;
		// var addLimitNum = ($.inArray(subcateId, limitSubIdArr) !== -1) ? 5 : 4;
		if (this.counter > addLimitNum) {
			var alertStr = '抱歉，您只能选择' + addLimitNum + '款对比产品'
			alert(alertStr);
			return false;
		}

		if (typeof (this.callback) == 'function') {
			return this.callback();
		}
		return false;
	},

	callback: function () {
		var proIdArr = this.sortProId();
		var param = proIdArr.join('-');
		this.compForm.action = this.postUrl.replace('{PARAM}', param);
		return true;
	}
};