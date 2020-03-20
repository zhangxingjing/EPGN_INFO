import re
import base64
import time
from pprint import pprint

from pptx import Presentation
from pptx.util import Inches, Pt
# from epgn_info.epgn_info.settings.devp import BASE_DIR    # Nginx
from epgn_info.settings.devp import BASE_DIR  # manage

model_path = BASE_DIR + '/apps/calculate/PPTModel/'


class ParsePPT():
    def __init__(self, item):
        """
        处理前端的数据
        :param item:前端传来的图片的位置信息
        """
        self.filename = time.strftime('%Y_%m_%d_%H_%M_%S',time.localtime(time.time()))
        self.prs = Presentation(model_path + "4zuo.pptx")
        # self.save_path = save_path
        self.data = item
        self.img_list = []
        self.vl = {}
        self.vr = {}
        self.ml = {}
        self.mr = {}
        self.hl = {}
        self.hr = {}
        self.rool = {}

    def parse_title(self):
        """
        处理当前PPT首页的标题
        :return: 直接操作全局变量，不返回
        """
        # 拿到第一页幻灯片
        # 把前端获取到的数据，填入幻灯片中

        blank_slide_layout = self.prs.slide_layouts[0]
        slide = self.prs.slides.add_slide(blank_slide_layout)
        # 设置要新建的文本框的位置
        left = top = width = height = Inches(1)
        # 实例化一个文本框
        txBox = slide.shapes.add_textbox(left, top, width, height)
        # 设置文件框的类型
        tf = txBox.text_frame
        # 给定文本框里的文字
        # tf.text = self.title
        # 添加段落，向下在添加段落文字
        p = tf.add_paragraph()
        # 给新增加的段落添加文字
        p.text = "This is a second add_paragraph that's bold"
        # 给新添加的段落文字设置为粗体
        p.font.bold = True
        # 再在这个文本框中新建一个段落
        p = tf.add_paragraph()
        # 设置新段落的文字
        p.text = "This is a third paragraph that's big"
        # 设置新添加的段落文字的字号为40
        p.font.size = Pt(40)

    def parse_pic(self):
        """
        处理前端返回的算法结果的图片 ==> base64--pic
        :return: 返回图片存储路径（图片使用完成后是否删除当前生成的图片）
        """
        """
        for noise in self.data["internal_noise"]:  # 内部噪声
            pic_info = noise["info"]
            for key, value in noise["data"].items():
                str_bas64 = re.match(r'(data:image/png;base64,(.*))', value).group(2)
                img = base64.b64decode(str_bas64)
                pic_path = self.save_path + 'image/{}.jpg'.format(pic_info + " " + key)
                fh = open(model_path + pic_path, 'wb')
                fh.write(img)
                fh.close()
                if key == "VL":
                    self.vl[pic_info] = pic_path
                elif key == "VR":
                    self.vr[pic_info] = pic_path
                elif key == "HL":
                    self.hl[pic_info] = pic_path
                elif key == "HR":
                    self.hr[pic_info] = pic_path
                elif key == "ML":
                    self.ml[pic_info] = pic_path
                elif key == "MR":
                    self.mr[pic_info] = pic_path

        pic_gun_info = self.data["roolgeraeush_noise"]["info"]
        for key, value in self.data["roolgeraeush_noise"]["data"].items():
            str_bas64 = re.match(r'(data:image/png;base64,(.*))', value).group(2)
            img = base64.b64decode(str_bas64)
            pic_path = self.save_path + 'image/{}.jpg'.format(pic_gun_info + " " + key)
            fh = open(model_path + pic_path, 'wb')
            fh.write(img)
            fh.close()
            if key == "VL":
                self.vl[pic_gun_info] = pic_path
            elif key == "VR":
                self.vr[pic_gun_info] = pic_path
            elif key == "HL":
                self.hl[pic_gun_info] = pic_path
            elif key == "HR":
                self.hr[pic_gun_info] = pic_path
        """

        # 在这里处理当前PPT，生成之后返回当前的PPT路径
        for item in self.data["items"]:
            pic_info = item["status"] + "_" + item["channel"]
            str_bas64 = re.match(r'(data:image/png;base64,(.*))', item["base64"]).group(2)
            img = base64.b64decode(str_bas64)
            pic_path = model_path + 'image/{}.jpg'.format(pic_info)
            fh = open(pic_path, 'wb')
            fh.write(img)
            # fh.close()

            # yield item["status"], item["channel"], pic_path
            img_dict = {
                "channel": item["channel"],
                "status": item["status"],
                "pic_path": pic_path
            }
            yield img_dict
            # self.img_list.append(img_dict)

    def insert_pic(self, img_dict):
        """
        通过处理后的前端数据，合成规定的报告
        :return:处理完成的PPT
        """

        # TODO: 后面多个工况在一起的情况怎么处理的？
        key_list = ['F3 VZ', 'G3 VZ', 'F3 VS', 'G3 VS', 'F5 VZ', 'G5 VZ', 'KP 80-20']

        """
        if self.ml:  # 要么是4坐， 要么就是6坐 ==> 复制幻灯片
            self.prs = Presentation(model_path + "PPTModel/6zuo.pptx")
            for key in key_list:
                num = key_list.index(key)
                # 左前
                left, top, width, height = Inches(0.5), Inches(1.6), Inches(4.5), Inches(2.4)
                self.prs.slides[2 * num + 1].shapes.add_picture('{}'.format(model_path + self.vl[key]), left, top,
                                                                width, height)
                # 右前
                left, top, width, height = Inches(5), Inches(1.6), Inches(4.5), Inches(2.4)
                self.prs.slides[2 * num + 1].shapes.add_picture('{}'.format(model_path + self.vr[key]), left, top,
                                                                width, height)
                # 左中
                left, top, width, height = Inches(0.5), Inches(4), Inches(4.5), Inches(2.4)
                self.prs.slides[2 * num + 1].shapes.add_picture('{}'.format(model_path + self.hl[key]), left, top,
                                                                width, height)
                # 右中
                left, top, width, height = Inches(5), Inches(4), Inches(4.5), Inches(2.4)
                self.prs.slides[2 * num + 1].shapes.add_picture('{}'.format(model_path + self.hr[key]), left, top,
                                                                width, height)
                # 左后
                left, top, width, height = Inches(0.5), Inches(1.6), Inches(4.5), Inches(2.4)
                self.prs.slides[2 * num + 2].shapes.add_picture('{}'.format(model_path + self.vl[key]), left, top,
                                                                width, height)
                # 右后
                left, top, width, height = Inches(5), Inches(1.6), Inches(4.5), Inches(2.4)
                self.prs.slides[2 * num + 2].shapes.add_picture('{}'.format(model_path + self.vr[key]), left, top,
                                                                width, height)
        else:
            for key in key_list:
                num = img_dict.index(key)
                # 左前
                left, top, width, height = Inches(0.5), Inches(1.6), Inches(4.5), Inches(2.4)
                self.prs.slides[num + 1].shapes.add_picture('{}'.format(img_dict[key]), left, top, width,height)
                # 右前
                left, top, width, height = Inches(5), Inches(1.6), Inches(4.5), Inches(2.4)
                self.prs.slides[num + 1].shapes.add_picture('{}'.format(img_dict[key]), left, top, width,height)
                # 左后
                left, top, width, height = Inches(0.5), Inches(4), Inches(4.5), Inches(2.4)
                self.prs.slides[num + 1].shapes.add_picture('{}'.format(img_dict[key]), left, top, width,height)
                # 右后
                left, top, width, height = Inches(5), Inches(4), Inches(4.5), Inches(2.4)
                self.prs.slides[num + 1].shapes.add_picture('{}'.format(img_dict[key]), left, top, width, height)
    """

        num = key_list.index(img_dict["status"]) - 1  # 根据当前工况在PPT中幻灯片的位置，放置当前IMG
        print(num, img_dict["channel"])
        if img_dict["channel"] == "VL" or img_dict["channel"] == "vorn links":
            # 左前
            left, top, width, height = Inches(0.5), Inches(1.6), Inches(4.5), Inches(2.4)
            self.prs.slides[num].shapes.add_picture('{}'.format(img_dict["pic_path"]), left, top, width, height)
        elif img_dict["channel"] == "VR" or img_dict["channel"] == "vorn rechits":
            # 右前
            left, top, width, height = Inches(5), Inches(1.6), Inches(4.5), Inches(2.4)
            self.prs.slides[num].shapes.add_picture('{}'.format(img_dict["pic_path"]), left, top, width, height)
        elif img_dict["channel"] == "HL" or img_dict["channel"] == "hinten links":
            # 左后
            left, top, width, height = Inches(0.5), Inches(4), Inches(4.5), Inches(2.4)
            self.prs.slides[num].shapes.add_picture('{}'.format(img_dict["pic_path"]), left, top, width, height)
        elif img_dict["channel"] == "HR" or img_dict["channel"] == "hinten rechits":
            # 右后
            left, top, width, height = Inches(5), Inches(4), Inches(4.5), Inches(2.4)
            self.prs.slides[num].shapes.add_picture('{}'.format(img_dict["pic_path"]), left, top, width, height)

    def save_ppt(self):
        """
        保存最终的PPT文件
        :return:PPT存储位置
        """
        self.prs.save(model_path + 'ppt_result/{}.pptx'.format(self.filename))
        return model_path + 'ppt_result/{}.pptx'.format(self.filename)

    def run(self):
        """
        面向对象的接口
        :return: 当前PPT存储的位置
        """
        try:
            # self.parse_title()
            for img_dict in self.parse_pic():
                self.insert_pic(img_dict)
            ppt_path = self.save_ppt()
            return ppt_path
        except Exception as e:
            raise Exception
