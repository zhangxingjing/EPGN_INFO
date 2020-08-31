import re

a = "/media/sf_Y_DRIVE/Database/H_HDF/2020-08-24_A SUVe_AEA-320_EKK-?rpm_A SUVe AEA-407_4-Motion brummen_4200rpm_70_13.8bar_run14.hdf"
b = re.findall(r'(.*)\.(.*.hdf)', a)
print((b[0][0]+b[0][1]).replace('?', ''))


c = "?asd/dasd".replace("?", "").replace('/', '')
print(c)