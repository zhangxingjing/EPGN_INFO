// 顶部筛选
$(document).ready(function () {


		var oUl = document.getElementById('select4');
		var Lis = oUl.getElementsByTagName('dd');
		for(var i = 0;i<Lis.length;i++){
			 Lis[i].index = i;
			Lis[i].onclick = function(){


				
			// alert("sec"+this.index )
			var app = document.getElementById('secSection');
			var qq = app.getElementsByTagName('div');
			// for(qq in app){
			// 	qq.length
			// }
		
			$('#secSection').children('div').addClass("sec");
			// qq[this.index-2].classList.add("sec")
			// qq[this.index-1].classList.add("sec")
			qq[this.index-1].classList.remove("sec")
			
			}
		}
	// $("select4 dd").click(function(){

	// 	$(this).removeClass("sec").siblings().addClass("sec");

	// })	

	// 这里定义点击的时候, 把点击的标签添加到下面的已选择里面
	$("#select1 dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#carmodel").remove();
		} else {
			var copyThisA = $(this).clone();
			if ($("#carmodel").length > 0) {
				$("#carmodel a").html($(this).text());
				$("#carmodel").on("click",function () {
					$(this).remove();
					$('#select1 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			} else {
				$(".select-result dl").append(copyThisA.attr("id", "carmodel"));
				$("#carmodel").on("click",function () {
					$(this).remove();
					$('#select1 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			}
		}
	});

	$("#select2 dd").on("click", function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#propulsion").remove();
		} else {
			var copyThisC = $(this).clone();
			if ($("#propulsion").length > 0) {
				$("#propulsion a").html($(this).text());
			$("#propulsion").on("click",function () {
				$(this).remove();
				$('#select2 dd.select-all').addClass("selected").siblings().removeClass("selected");	
			})

			} else {
				$(".select-result dl").append(copyThisC.attr("id", "propulsion"));
				$("#propulsion").on("click",function () {
					$(this).remove();
					$('#select2 dd.select-all').addClass("selected").siblings().removeClass("selected")
				})
			}
		}
	});

	$("#select3 dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#power").remove();
		} else {
			var copyThisC = $(this).clone();
			if ($("#power").length > 0) {
				$("#power a").html($(this).text());
				$("#power").on("click",function () {
					$(this).remove();
					$('#select3 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			} else {
				$(".select-result dl").append(copyThisC.attr("id", "power"));
				$("#power").on("click",function () {
					$(this).remove();
					$('#select3 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			}
		}
	});

	$("#select4 dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		$('#secSection div').children('dd').removeClass("selected");
		$("#parts").remove();
		$('#select5 dd.select-all').addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#discipline").remove();
		} else {
			var copyThisC = $(this).clone();
			if ($("#discipline").length > 0) {
				$("#discipline a").html($(this).text());
				$("#discipline").on("click",function () {
					$(this).remove();
					$('#select4 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			} else {
				$(".select-result dl").append(copyThisC.attr("id", "discipline"));
				$("#discipline").on("click",function () {
					$(this).remove();
					$('#select4 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			}
		}
	});

	$("#select5 dd").click(function () {
		$('#secSection div').children('dd').removeClass("selected");
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#parts").remove();
			$('#secSection div').children('dd').removeClass("selected");
		} else {
			var copyThisC = $(this).clone();
			$('.sec5').removeClass("selected");
			
			if ($("#parts").length > 0) {
				$("#parts a").html($(this).text());
				$("#parts").on("click",function () {
					$(this).remove();
					$('#secSection div').children('dd').removeClass("selected");
					$('#select5 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			} else {
				$(".select-result dl").append(copyThisC.attr("id", "parts"));
				$("#parts").on("click",function () {
					$(this).remove();
					$('#secSection div').children('dd').removeClass("selected");
					$('#select5 dd.select-all').addClass("selected").siblings().removeClass("selected");	
				})
			}
		}
	});

	// 下面是点击出现的效果
	// 使用jquery3.4和1.7在这里是不同的，没有live()方法了

	// $("#selectA").on("click", function () {
	// 	$(this).remove();
	// 	$("#select1 .select-all").addClass("selected").siblings().removeClass("selected");
	// });


	$("#carmodel.a").on("click", function (event) {
		alert($(this).children('a').html());
		$(this).remove();
		$("#select2 .select-all").addClass("selected").siblings().removeClass("selected");
	});

	$("#propulsion").on("click", function (event) {
		$(this).remove();
		$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
	});

	$("#power").on("click", function (event) {
		$(this).remove();
		$("#select5 .select-all").addClass("selected").siblings().removeClass("selected");
	});

	$("#discipline").on("click", function (event) {
		$(this).remove();
		$("#select4 .select-all").addClass("selected").siblings().removeClass("selected");
	});

	$("#parts").on("click", function (event) {
		$(this).remove();
		$("#select6 .select-all").addClass("selected").siblings().removeClass("selected");
	});

	$(".select dd").on(function (event) {
		if ($(".select-result dd").length > 1) { // 如果出现筛选条件，这里就把这个标签隐藏
			$(".select-no").show();
		} else {
			$(".select-no").hide();
		}
	});
});