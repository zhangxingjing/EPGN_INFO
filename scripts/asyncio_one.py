# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : asyncio_one
# Datetime : 2020/8/21 上午9:09

import asyncio
import aiohttp


async def get_category():
    async with aiohttp.ClientSession() as session:
        while True:
            try:
                async with session.get("url") as response:
                    html = await response.text()

                    # 在这里获取网页信息

            except:
                pass
            await asyncio.sleep(5)


asyncio.run(get_category())
