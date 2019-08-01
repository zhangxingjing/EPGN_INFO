insert into `tb_direction` values ('01', '整车声学', NULL);

insert into `tb_direction` values ('0101', '整车内部噪声', '01');
insert into `tb_direction` values ('010101', '(N)G2 VZ', '0101');
insert into `tb_direction` values ('010102', '(N)G3 VZ', '0101');
insert into `tb_direction` values ('010103', '(N)G5 VZ', '0101');
insert into `tb_direction` values ('010104', '(N)G2 VS', '0101');
insert into `tb_direction` values ('010105', '(N)G3 VS', '0101');
insert into `tb_direction` values ('010106', '(N)G5 VS', '0101');
insert into `tb_direction` values ('010107', '(N)60 km/h', '0101');
insert into `tb_direction` values ('010108', '(N)80 km/h', '0101');
insert into `tb_direction` values ('010109', '(N)100 km/h', '0101');
insert into `tb_direction` values ('010110', '(N)120 km/h', '0101');
insert into `tb_direction` values ('010111', '(N)20-100km/h VZ', '0101');
insert into `tb_direction` values ('010112', '(N)20-100km/h VS', '0101');
insert into `tb_direction` values ('010113', '(N)20-100km/h TZ 30s', '0101');

insert into `tb_direction` values ('0102', '整车滚动噪声', '01');
insert into `tb_direction` values ('010201', 'KP 80-20', '0102');
insert into `tb_direction` values ('010202', 'Kerber 60', '0102');
insert into `tb_direction` values ('010203', 'Kerber 80', '0102');
insert into `tb_direction` values ('010204', 'Stu 50-30', '0102');
insert into `tb_direction` values ('010205', 'Schlage 30', '0102');

insert into `tb_direction` values ('0103', '整车怠速启停', '01');
insert into `tb_direction` values ('010301', '(Square&Lab)Leerlauf N Gang ohne Verbrauche', '0103');
insert into `tb_direction` values ('010302', '(Square&Lab)Leerlauf N Gang mit Verbrauche', '0103');
insert into `tb_direction` values ('010303', '(Square&Lab)Leerlauf N Gang mit AC', '0103');
insert into `tb_direction` values ('010304', '(Square&Lab)Leerlauf P Gang ohne Verbrauche', '0103');
insert into `tb_direction` values ('010305', '(Square&Lab)Leerlauf P Gang mit Verbrauche', '0103');
insert into `tb_direction` values ('010306', '(Square&Lab)Leerlauf P Gang mit AC', '0103');
insert into `tb_direction` values ('010307', '(Square&Lab)Leerlauf D Gang ohne Verbrauche', '0103');
insert into `tb_direction` values ('010308', '(Square&Lab)Leerlauf D Gang mit Verbrauche', '0103');
insert into `tb_direction` values ('010309', '(Square&Lab)Leerlauf D Gang mit AC', '0103');
insert into `tb_direction` values ('010310', '(Square&Lab)Leerlauf R Gang ohne Verbrauche', '0103');
insert into `tb_direction` values ('010311', '(Square&Lab)Leerlauf R Gang mit Verbrauche', '0103');
insert into `tb_direction` values ('010312', '(Square&Lab)Leerlauf R Gang mit AC', '0103');
insert into `tb_direction` values ('010313', '(Square&Lab)St-Sp', '0103');

insert into `tb_direction` values ('0104', '转向柱固有频率', '01');
insert into `tb_direction` values ('010301', 'Lenkred Frequencoi', '0104');

insert into `tb_direction` values ('02', '辅助总成声学', NULL);
insert into `tb_direction` values ('0204', '风扇(整车)', '02');
insert into `tb_direction` values ('020401', 'rated PWM', '0204');
insert into `tb_direction` values ('020402', 'hochlauf', '0204');
insert into `tb_direction` values ('020403', 'down', '0204');

insert into `tb_direction` values ('0205', '风扇(台架)', '02');
insert into `tb_direction` values ('020501', 'rated PWM', '0205');
insert into `tb_direction` values ('020502', 'hochlauf', '0205');
insert into `tb_direction` values ('020503', 'down', '0205');

insert into `tb_direction` values ('0206', '空调中间耳旁(整车)', '02');
insert into `tb_direction` values ('020601', 'out-face-cold', '0206');
insert into `tb_direction` values ('020602', 'in-face-cold', '0206');
insert into `tb_direction` values ('020603', 'out-defrost-warm', '0206');

insert into `tb_direction` values ('0207', '空调左侧出风口(整车)', '02');
insert into `tb_direction` values ('020701', 'out-face-cold-vent L', '0207');
insert into `tb_direction` values ('020702', 'in-face-cold-vent L', '0207');
insert into `tb_direction` values ('020703', 'out-defrost-warm-vent L', '0207');

insert into `tb_direction` values ('0208', '空调中央左侧出风口(整车)', '02');
insert into `tb_direction` values ('020801', 'out-face-cold-vent ML', '0208');
insert into `tb_direction` values ('020802', 'in-face-cold-vent ML', '0208');
insert into `tb_direction` values ('020803', 'out-defrost-warm-vent ML', '0208');

insert into `tb_direction` values ('0209', '空调中央右侧出风口(整车)', '02');
insert into `tb_direction` values ('020901', 'out-face-cold-vent MR', '0209');
insert into `tb_direction` values ('020902', 'in-face-cold-vent MR', '0209');
insert into `tb_direction` values ('020903', 'out-defrost-warm-vent MR', '0209');

insert into `tb_direction` values ('0210', '空调右侧出风口(整车)', '02');
insert into `tb_direction` values ('021001', 'out-face-cold-vent R', '0210');
insert into `tb_direction` values ('021002', 'in-face-cold-vent R', '0210');
insert into `tb_direction` values ('021003', 'out-defrost-warm-vent R', '0210');

insert into `tb_direction` values ('0211', '空调除霜出风口(整车)', '02');
insert into `tb_direction` values ('021101', 'out-face-cold-vent D', '0211');
insert into `tb_direction` values ('021102', 'in-face-cold-vent D', '0211');
insert into `tb_direction` values ('021103', 'out-defrost-warm-vent D', '0211');

insert into `tb_direction` values ('0212', '空调(台架)', '02');
insert into `tb_direction` values ('021201', 'out-face-cold-?kg/h', '0212');
insert into `tb_direction` values ('021202', 'out-face-cold-hochlauf', '0212');
insert into `tb_direction` values ('021203', 'out-defrost-warm-?kg/h', '0212');
insert into `tb_direction` values ('021204', 'out-defrost-warm-hochlauf', '0212');

insert into `tb_direction` values ('0213', '发电机', '02');
insert into `tb_direction` values ('021301', 'Generator-P Zug-electric on', '0213');
insert into `tb_direction` values ('021302', 'Generator-P Schub-electric on', '0213');
insert into `tb_direction` values ('021303', 'Generator-P Zug-electric off', '0213');
insert into `tb_direction` values ('021304', 'Generator-P Schub-electric off', '0213');

insert into `tb_direction` values ('0214', '压缩机', '02');
insert into `tb_direction` values ('021401', 'Compressor-P LL', '0214');
insert into `tb_direction` values ('021402', 'Compressor-P Zug', '0214');
insert into `tb_direction` values ('021403', 'EKK-?rpm', '0214');
insert into `tb_direction` values ('021404', 'EKK-hochlauf', '0214');

insert into `tb_direction` values ('0215', '摇窗机', '02');
insert into `tb_direction` values ('021501', 'Fensterheber-VL-up', '0215');
insert into `tb_direction` values ('021502', 'Fensterheber-VR-up', '0215');
insert into `tb_direction` values ('021503', 'Fensterheber-HL-up', '0215');
insert into `tb_direction` values ('021504', 'Fensterheber-HR-up', '0215');

insert into `tb_direction` values ('0216', '电动后盖撑杆', '02');
insert into `tb_direction` values ('021601', 'HKL-open', '0216');
insert into `tb_direction` values ('021602', 'HKL-close', '0216');

insert into `tb_direction` values ('0217', '燃油泵', '02');
insert into `tb_direction` values ('021701', 'MotorLL_Pumpestationaer_R1', '0217');
insert into `tb_direction` values ('021702', 'Motoraus_Pumpestationaer _R1', '0217');
insert into `tb_direction` values ('021703', 'Motoraus_Pumpehochlauf_R1', '0217');

insert into `tb_direction` values ('0218', '天窗', '02');
insert into `tb_direction` values ('021801', 'PSD-Rollo-open', '0218');
insert into `tb_direction` values ('021802', 'PSD-Rollo-close', '0218');
insert into `tb_direction` values ('021803', 'PSD-Glas-open', '0218');
insert into `tb_direction` values ('021804', 'PSD-Glas-close', '0218');
insert into `tb_direction` values ('021805', 'PSD-Kippen-open', '0218');
insert into `tb_direction` values ('021806', 'PSD-Kippen-close', '0218');
insert into `tb_direction` values ('021807', 'SAD-open', '0218');
insert into `tb_direction` values ('021808', 'SAD-close', '0218');
insert into `tb_direction` values ('021809', 'SAD-Kippen-open', '0218');
insert into `tb_direction` values ('021810', 'SAD-Kippen-close', '0218');

insert into `tb_direction` values ('0219', '前/后雨刮', '02');
insert into `tb_direction` values ('021901', 'Front Wisher-Motor-stufe1', '0219');
insert into `tb_direction` values ('021902', 'Front Wisher-Motor-stufe2', '0219');
insert into `tb_direction` values ('021903', 'Front Wisher-Wiper-stufe1', '0219');
insert into `tb_direction` values ('021904', 'Front Wisher-Wiper-stufe2', '0219');
insert into `tb_direction` values ('021905', 'Rear Wisher-Motor-stufe1', '0219');
insert into `tb_direction` values ('021906', 'Rear Wisher-Motor-stufe2', '0219');
insert into `tb_direction` values ('021907', 'Rear Wisher-Wiper-stufe1', '0219');
insert into `tb_direction` values ('021908', 'Rear Wisher-Wiper-stufe2', '0219');

insert into `tb_direction` values ('0220', '导航风扇', '02');
insert into `tb_direction` values ('022001', 'Navi fan-?rpm', '0220');

insert into `tb_direction` values ('0221', '座椅通风', '02');
insert into `tb_direction` values ('022101', 'Klimasitz-Stufe1', '0221');
insert into `tb_direction` values ('022102', 'Klimasitz-Stufe2', '0221');
insert into `tb_direction` values ('022103', 'Klimasitz-Stufe3', '0221');

insert into `tb_direction` values ('0222', '外后视镜(台架)', '02');
insert into `tb_direction` values ('022201', 'ASP_left_M-R', '0222');
insert into `tb_direction` values ('022202', 'ASP_left_R-L', '0222');
insert into `tb_direction` values ('022203', 'ASP_left_L-M', '0222');
insert into `tb_direction` values ('022204', 'ASP_left_M-O', '0222');
insert into `tb_direction` values ('022205', 'ASP_left_O-U', '0222');
insert into `tb_direction` values ('022206', 'ASP_left_U-M', '0222');
insert into `tb_direction` values ('022207', 'ASP_right_M-R', '0222');
insert into `tb_direction` values ('022208', 'ASP_right_R-L', '0222');
insert into `tb_direction` values ('022209', 'ASP_right_L-M', '0222');
insert into `tb_direction` values ('022210', 'ASP_right_M-O', '0222');
insert into `tb_direction` values ('022211', 'ASP_right_O-U', '0222');
insert into `tb_direction` values ('022212', 'ASP_right_U-M', '0222');
insert into `tb_direction` values ('022213', 'ASP_left_F-P', '0222');
insert into `tb_direction` values ('022214', 'ASP_left_P-F', '0222');
insert into `tb_direction` values ('022215', 'ASP_right_F-P', '0222');
insert into `tb_direction` values ('022216', 'ASP_right_P-F', '0222');

insert into `tb_direction` values ('03', '进排气及法规声学', NULL);
insert into `tb_direction` values ('0301', '排气系统', '03');
insert into `tb_direction` values ('030101', '(Lab) F2 VZ', '0301');
insert into `tb_direction` values ('030102', '(Lab) F3 VZ', '0301');
insert into `tb_direction` values ('030103', '(Lab) F4 VZ', '0301');
insert into `tb_direction` values ('030104', '(Lab) F5 VZ', '0301');
insert into `tb_direction` values ('030105', '(Lab) F2 VS', '0301');
insert into `tb_direction` values ('030106', '(Lab) F3 VS', '0301');
insert into `tb_direction` values ('030107', '(Lab) F4 VS', '0301');
insert into `tb_direction` values ('030108', '(Lab) F5 VS', '0301');
insert into `tb_direction` values ('030109', '(Lab) P LL ohne AC', '0301');
insert into `tb_direction` values ('030110', '(Lab) P LL mit AC', '0301');
insert into `tb_direction` values ('030111', '(Lab) D LL ohne AC', '0301');
insert into `tb_direction` values ('030112', '(Lab) D LL mit AC', '0301');
insert into `tb_direction` values ('030113', '(N) F2 VZ', '0301');
insert into `tb_direction` values ('030114', '(N) F3 VZ', '0301');
insert into `tb_direction` values ('030115', '(N) F4 VZ', '0301');
insert into `tb_direction` values ('030116', '(N) F5 VZ', '0301');
insert into `tb_direction` values ('030117', '(N) F2 VS', '0301');
insert into `tb_direction` values ('030118', '(N) F3 VS', '0301');
insert into `tb_direction` values ('030119', '(N) F4 VS', '0301');
insert into `tb_direction` values ('030120', '(N) F5 VS', '0301');
insert into `tb_direction` values ('030121', '(N) P LL ohne AC', '0301');
insert into `tb_direction` values ('030122', '(N) P LL mit AC', '0301');
insert into `tb_direction` values ('030123', '(N) D LL ohne AC', '0301');
insert into `tb_direction` values ('030124', '(N) D LL mit AC', '0301');

insert into `tb_direction` values ('0302', '排气结构声', '03');
insert into `tb_direction` values ('030201', '(Lab) F2 VZ', '0302');
insert into `tb_direction` values ('030202', '(Lab) F3 VZ', '0302');
insert into `tb_direction` values ('030203', '(Lab) F4 VZ', '0302');
insert into `tb_direction` values ('030204', '(Lab) F5 VZ', '0302');
insert into `tb_direction` values ('030205', '(Lab) F2 VS', '0302');
insert into `tb_direction` values ('030206', '(Lab) F3 VS', '0302');
insert into `tb_direction` values ('030207', '(Lab) F4 VS', '0302');
insert into `tb_direction` values ('030208', '(Lab) F5 VS', '0302');
insert into `tb_direction` values ('030209', '(Lab) P LL ohne AC', '0302');
insert into `tb_direction` values ('030210', '(Lab) P LL mit AC', '0302');
insert into `tb_direction` values ('030211', '(Lab) D LL ohne AC', '0302');
insert into `tb_direction` values ('030212', '(Lab) D LL mit AC', '0302');
insert into `tb_direction` values ('030213', '(N) F2 VZ', '0302');
insert into `tb_direction` values ('030214', '(N) F3 VZ', '0302');
insert into `tb_direction` values ('030215', '(N) F4 VZ', '0302');
insert into `tb_direction` values ('030216', '(N) F5 VZ', '0302');
insert into `tb_direction` values ('030217', '(N) F2 VS', '0302');
insert into `tb_direction` values ('030218', '(N) F3 VS', '0302');
insert into `tb_direction` values ('030219', '(N) F4 VS', '0302');
insert into `tb_direction` values ('030220', '(N) F5 VS', '0302');
insert into `tb_direction` values ('030221', '(N) P LL ohne AC', '0302');
insert into `tb_direction` values ('030222', '(N) P LL mit AC', '0302');
insert into `tb_direction` values ('030223', '(N) D LL ohne AC', '0302');
insert into `tb_direction` values ('030224', '(N) D LL mit AC', '0302');

insert into `tb_direction` values ('0303', '排气次级声', '03');
insert into `tb_direction` values ('030301', '(Lab) F2 VZ', '0303');
insert into `tb_direction` values ('030302', '(Lab) F3 VZ', '0303');
insert into `tb_direction` values ('030303', '(Lab) F4 VZ', '0303');
insert into `tb_direction` values ('030304', '(Lab) F5 VZ', '0303');
insert into `tb_direction` values ('030305', '(Lab) F2 VS', '0303');
insert into `tb_direction` values ('030306', '(Lab) F3 VS', '0303');
insert into `tb_direction` values ('030307', '(Lab) F4 VS', '0303');
insert into `tb_direction` values ('030308', '(Lab) F5 VS', '0303');
insert into `tb_direction` values ('030309', '(Lab) P LL ohne AC', '0303');
insert into `tb_direction` values ('030310', '(Lab) P LL mit AC', '0303');
insert into `tb_direction` values ('030311', '(Lab) D LL ohne AC', '0303');
insert into `tb_direction` values ('030312', '(Lab) D LL mit AC', '0303');
insert into `tb_direction` values ('030313', '(N) F2 VZ', '0303');
insert into `tb_direction` values ('030314', '(N) F3 VZ', '0303');
insert into `tb_direction` values ('030315', '(N) F4 VZ', '0303');
insert into `tb_direction` values ('030316', '(N) F5 VZ', '0303');
insert into `tb_direction` values ('030317', '(N) F2 VS', '0303');
insert into `tb_direction` values ('030318', '(N) F3 VS', '0303');
insert into `tb_direction` values ('030319', '(N) F4 VS', '0303');
insert into `tb_direction` values ('030320', '(N) F5 VS', '0303');
insert into `tb_direction` values ('030321', '(N) P LL ohne AC', '0303');
insert into `tb_direction` values ('030322', '(N) P LL mit AC', '0303');
insert into `tb_direction` values ('030323', '(N) D LL ohne AC', '0303');
insert into `tb_direction` values ('030324', '(N) D LL mit AC', '0303');

insert into `tb_direction` values ('0304', '排气管口噪声', '03');
insert into `tb_direction` values ('030401', '(Lab) F2 VZ', '0304');
insert into `tb_direction` values ('030402', '(Lab) F3 VZ', '0304');
insert into `tb_direction` values ('030403', '(Lab) F4 VZ', '0304');
insert into `tb_direction` values ('030404', '(Lab) F5 VZ', '0304');
insert into `tb_direction` values ('030405', '(Lab) F2 VS', '0304');
insert into `tb_direction` values ('030406', '(Lab) F3 VS', '0304');
insert into `tb_direction` values ('030407', '(Lab) F4 VS', '0304');
insert into `tb_direction` values ('030408', '(Lab) F5 VS', '0304');
insert into `tb_direction` values ('030409', '(Lab) P LL ohne AC', '0304');
insert into `tb_direction` values ('030410', '(Lab) P LL mit AC', '0304');
insert into `tb_direction` values ('030411', '(Lab) D LL ohne AC', '0304');
insert into `tb_direction` values ('030412', '(Lab) D LL mit AC', '0304');
insert into `tb_direction` values ('030413', '(N) F2 VZ', '0304');
insert into `tb_direction` values ('030414', '(N) F3 VZ', '0304');
insert into `tb_direction` values ('030415', '(N) F4 VZ', '0304');
insert into `tb_direction` values ('030416', '(N) F5 VZ', '0304');
insert into `tb_direction` values ('030417', '(N) F2 VS', '0304');
insert into `tb_direction` values ('030418', '(N) F3 VS', '0304');
insert into `tb_direction` values ('030419', '(N) F4 VS', '0304');
insert into `tb_direction` values ('030420', '(N) F5 VS', '0304');
insert into `tb_direction` values ('030421', '(N) P LL ohne AC', '0304');
insert into `tb_direction` values ('030422', '(N) P LL mit AC', '0304');
insert into `tb_direction` values ('030423', '(N) D LL ohne AC', '0304');
insert into `tb_direction` values ('030424', '(N) D LL mit AC', '0304');

insert into `tb_direction` values ('0305', '进气系统', '03');
insert into `tb_direction` values ('030501', '(Lab) F3 VZ', '0305');
insert into `tb_direction` values ('030502', '(Lab) F4 VZ', '0305');
insert into `tb_direction` values ('030503', '(Lab) F3 VS', '0305');
insert into `tb_direction` values ('030504', '(Lab) F4 VS', '0305');
insert into `tb_direction` values ('030505', '(N) F3 VZ', '0305');
insert into `tb_direction` values ('030506', '(N) F4 VZ', '0305');
insert into `tb_direction` values ('030507', '(N) F3 VS', '0305');
insert into `tb_direction` values ('030508', '(N) F4 VS', '0305');

insert into `tb_direction` values ('0306', '进气进气管', '03');
insert into `tb_direction` values ('030601', '(Lab) F3 VZ', '0306');
insert into `tb_direction` values ('030602', '(Lab) F4 VZ', '0306');
insert into `tb_direction` values ('030603', '(Lab) F3 VS', '0306');
insert into `tb_direction` values ('030604', '(Lab) F4 VS', '0306');
insert into `tb_direction` values ('030605', '(N) F3 VZ', '0306');
insert into `tb_direction` values ('030606', '(N) F4 VZ', '0306');
insert into `tb_direction` values ('030607', '(N) F3 VS', '0306');
insert into `tb_direction` values ('030608', '(N) F4 VS', '0306');

insert into `tb_direction` values ('0307', '进气导流板', '03');
insert into `tb_direction` values ('030701', '(Lab) F3 VZ', '0307');
insert into `tb_direction` values ('030702', '(Lab) F4 VZ', '0307');
insert into `tb_direction` values ('030703', '(Lab) F3 VS', '0307');
insert into `tb_direction` values ('030704', '(Lab) F4 VS', '0307');
insert into `tb_direction` values ('030705', '(N) F3 VZ', '0307');
insert into `tb_direction` values ('030706', '(N) F4 VZ', '0307');
insert into `tb_direction` values ('030707', '(N) F3 VS', '0307');
insert into `tb_direction` values ('030708', '(N) F4 VS', '0307');

insert into `tb_direction` values ('0308', '进气空滤', '03');
insert into `tb_direction` values ('030801', '(Lab) F3 VZ', '0308');
insert into `tb_direction` values ('030802', '(Lab) F4 VZ', '0308');
insert into `tb_direction` values ('030803', '(Lab) F3 VS', '0308');
insert into `tb_direction` values ('030804', '(Lab) F4 VS', '0308');
insert into `tb_direction` values ('030805', '(N) F3 VZ', '0308');
insert into `tb_direction` values ('030806', '(N) F4 VZ', '0308');
insert into `tb_direction` values ('030807', '(N) F3 VS', '0308');
insert into `tb_direction` values ('030808', '(N) F4 VS', '0308');

insert into `tb_direction` values ('0309', '进气1/4波长管', '03');
insert into `tb_direction` values ('030901', '(Lab) F3 VZ', '0309');
insert into `tb_direction` values ('030902', '(Lab) F4 VZ', '0309');
insert into `tb_direction` values ('030903', '(Lab) F3 VS', '0309');
insert into `tb_direction` values ('030904', '(Lab) F4 VS', '0309');
insert into `tb_direction` values ('030905', '(N) F3 VZ', '0309');
insert into `tb_direction` values ('030906', '(N) F4 VZ', '0309');
insert into `tb_direction` values ('030907', '(N) F3 VS', '0309');
insert into `tb_direction` values ('030908', '(N) F4 VS', '0309');

insert into `tb_direction` values ('0310', '进气谐振腔', '03');
insert into `tb_direction` values ('031001', '(Lab) F3 VZ', '0310');
insert into `tb_direction` values ('031002', '(Lab) F4 VZ', '0310');
insert into `tb_direction` values ('031003', '(Lab) F3 VS', '0310');
insert into `tb_direction` values ('031004', '(Lab) F4 VS', '0310');
insert into `tb_direction` values ('031005', '(N) F3 VZ', '0310');
insert into `tb_direction` values ('031006', '(N) F4 VZ', '0310');
insert into `tb_direction` values ('031007', '(N) F3 VS', '0310');
insert into `tb_direction` values ('031008', '(N) F4 VS', '0310');

insert into `tb_direction` values ('0311', '进气波纹管', '03');
insert into `tb_direction` values ('031101', '(Lab) F3 VZ', '0311');
insert into `tb_direction` values ('031102', '(Lab) F4 VZ', '0311');
insert into `tb_direction` values ('031103', '(Lab) F3 VS', '0311');
insert into `tb_direction` values ('031104', '(Lab) F4 VS', '0311');
insert into `tb_direction` values ('031105', '(N) F3 VZ', '0311');
insert into `tb_direction` values ('031106', '(N) F4 VZ', '0311');
insert into `tb_direction` values ('031107', '(N) F3 VS', '0311');
insert into `tb_direction` values ('031108', '(N) F4 VS', '0311');



insert into `tb_direction` values ('04', '动力总成声学', Null);
insert into `tb_direction` values ('0401', '涡轮增压器', '04');
insert into `tb_direction` values ('040101', '(N) F2 VZ', '0401');
insert into `tb_direction` values ('040102', '(N) F3 VZ', '0401');
insert into `tb_direction` values ('040103', '(N) F4 VZ', '0401');
insert into `tb_direction` values ('040104', '(N) F2 TZ', '0401');
insert into `tb_direction` values ('040105', '(N) F3 TZ', '0401');
insert into `tb_direction` values ('040106', '(N) F4 TZ', '0401');

insert into `tb_direction` values ('0402', '发动机整车', '04');
insert into `tb_direction` values ('040201', '(N) Oeltep 0° LL', '0402');
insert into `tb_direction` values ('040202', '(N) Oeltep 0° Hochlauf', '0402');
insert into `tb_direction` values ('040203', '(N) Oeltep 0° Gasstoss', '0402');
insert into `tb_direction` values ('040205', '(N) Oeltep 30° LL', '0402');
insert into `tb_direction` values ('040206', '(N) Oeltep 30° Hochlauf', '0402');
insert into `tb_direction` values ('040207', '(N) Oeltep 30° Gasstoss', '0402');
insert into `tb_direction` values ('040209', '(N) Oeltep 90° LL', '0402');
insert into `tb_direction` values ('040210', '(N) Oeltep 90° Hochlauf', '0402');
insert into `tb_direction` values ('040211', '(N) Oeltep 90° Gasstoss', '0402');
insert into `tb_direction` values ('040212', '(N) Oeltep 90° F3 VZ', '0402');
insert into `tb_direction` values ('040213', '(N) Oeltep 90° F3 VS', '0402');

insert into `tb_direction` values ('0403', '高压油泵', '04');
insert into `tb_direction` values ('040301', '(Lab) N ohneAC', '0403');

insert into `tb_direction` values ('0404', '发动机声功率', '04');
insert into `tb_direction` values ('040401', '(Lab) F2 VZ', '0404');
insert into `tb_direction` values ('040402', '(Lab) F3 VZ', '0404');
insert into `tb_direction` values ('040403', '(Lab) F4 VZ', '0404');
insert into `tb_direction` values ('040404', '(Lab) F2 VS', '0404');
insert into `tb_direction` values ('040405', '(Lab) F3 VS', '0404');
insert into `tb_direction` values ('040406', '(Lab) F4 VS', '0404');
insert into `tb_direction` values ('040407', '(Lab) D Gang VZ', '0404');
insert into `tb_direction` values ('040408', '(Lab) D Gang TZ', '0404');
insert into `tb_direction` values ('040409', '(Lab) P Ohne AC', '0404');

insert into `tb_direction` values ('0405', '进气增压管', '04');
insert into `tb_direction` values ('040501', '(Lab) F2 VZ', '0405');
insert into `tb_direction` values ('040502', '(Lab) F3 VZ', '0405');
insert into `tb_direction` values ('040503', '(Lab) F4 VZ', '0405');

insert into `tb_direction` values ('0406', '发动机台架', '04');
insert into `tb_direction` values ('040601', '(Lab) Vollast HL', '0406');
insert into `tb_direction` values ('040602', '(Lab) Schlepp HL', '0406');
insert into `tb_direction` values ('040603', '(Lab) Schlepp HL Ohne Poly V Riemen', '0406');
insert into `tb_direction` values ('040604', '(Lab) Schlepp HL Ohne Einspritzung', '0406');
insert into `tb_direction` values ('040605', '(Lab) Leerlauf', '0406');
insert into `tb_direction` values ('040606', '(Lab) Gasstoss', '0406');
insert into `tb_direction` values ('040607', '(Lab) Gasstoss kalt Oel Raumtemperatur', '0406');
insert into `tb_direction` values ('040608', '(Lab) kaltstart Oel Raumtemperatur', '0406');

insert into `tb_direction` values ('0407', '插电混合动力电驱动总成(整车)', '04');
insert into `tb_direction` values ('040701', '(N) M1 VZ&Schub', '0407');
insert into `tb_direction` values ('040702', '(N) M2 VZ&Schub', '0407');
insert into `tb_direction` values ('040703', '(N) M3 VZ&Schub', '0407');
insert into `tb_direction` values ('040704', '(N) M4 VZ&Schub', '0407');
insert into `tb_direction` values ('040705', '(N) M5 VZ&Schub', '0407');
insert into `tb_direction` values ('040706', '(N) M6 VZ&Schub', '0407');
insert into `tb_direction` values ('040707', '(N) D 10-120kph VZ', '0407');
insert into `tb_direction` values ('040708', '(N) B 120-10kph Schub', '0407');
insert into `tb_direction` values ('040709', '(N) D 60-0Kph Schub mit Bremse', '0407');

insert into `tb_direction` values ('0408', '纯电动力电驱动总成(整车)', '04');
insert into `tb_direction` values ('040801', '(N) D 10-120kph VZ', '0408');
insert into `tb_direction` values ('040802', '(N) B 120-10kph Schub', '0408');
insert into `tb_direction` values ('040803', '(N) D 60-0Kph Schub mit Bremse', '0408');



insert into `tb_direction` values ('05', '车身及仿真声学', Null);
insert into `tb_direction` values ('0501', '整车内部噪声', '05');
insert into `tb_direction` values ('050101', '(N) G2 VZ NTF', '0501');
insert into `tb_direction` values ('050102', '(N) G3 VZ NTF', '0501');
insert into `tb_direction` values ('050103', '(N) G5 VZ NTF', '0501');
insert into `tb_direction` values ('050104', '(N) G2 VS NTF', '0501');
insert into `tb_direction` values ('050105', '(N) G3 VS NTF', '0501');
insert into `tb_direction` values ('050106', '(N) G5 VS NTF', '0501');
insert into `tb_direction` values ('0502', '整车滚动噪声', '05');
insert into `tb_direction` values ('050201', 'KP 80-20 NTF', '0502');
insert into `tb_direction` values ('0503', '座椅', '05');
insert into `tb_direction` values ('050301', 'Stu 50-30 NTF', '0503');


insert into `tb_direction` values ('06', '声学包', Null);
insert into `tb_direction` values ('0601', '整车内部噪声', '06    ');
insert into `tb_direction` values ('060101', '(N) G2 VZ NTF', '0601');
insert into `tb_direction` values ('060102', '(N) G3 VZ NTF', '0601');
insert into `tb_direction` values ('060103', '(N) G5 VZ NTF', '0601');
insert into `tb_direction` values ('060104', '(N) G2 VS NTF', '0601');
insert into `tb_direction` values ('060105', '(N) G3 VS NTF', '0601');
insert into `tb_direction` values ('060106', '(N) G5 VS NTF', '0601');
insert into `tb_direction` values ('0602', '整车滚动噪声', '06');
insert into `tb_direction` values ('060201', 'KP 80-20 NTF', '0602');
insert into `tb_direction` values ('060202', 'Kelber 80', '0602');


insert into `tb_direction` values ('07', '底盘及动力总成支撑声学', Null);
insert into `tb_direction` values ('0701', '轮胎(室内转鼓)', '07');
insert into `tb_direction` values ('070101', '(Lab) 60km/h', '0701');
insert into `tb_direction` values ('070102', '(Lab) 80km/h', '0701');
insert into `tb_direction` values ('070103', '(Lab) 100km/h', '0701');
insert into `tb_direction` values ('070104', '(Lab) 120km/h', '0701');
insert into `tb_direction` values ('070105', '20-100km/h', '0701');

insert into `tb_direction` values ('0702', '稳速轮胎噪声(室外)', '07');
insert into `tb_direction` values ('070201', '(N) 60km/h', '0702');
insert into `tb_direction` values ('070202', '(N) 80km/h', '0702');
insert into `tb_direction` values ('070203', '(N) 100km/h', '0702');
insert into `tb_direction` values ('070204', '(N) 120km/h', '0702');

insert into `tb_direction` values ('0703', '滚动噪声(室外)', '07');
insert into `tb_direction` values ('070301', 'Kp 80-20', '0703');

insert into `tb_direction` values ('0704', '轮胎唱歌声', '07');
insert into `tb_direction` values ('070401', 'Kerbe 80', '0704');

insert into `tb_direction` values ('0705', '内部噪声-支撑', '07');
insert into `tb_direction` values ('070501', '(N) F2 VZ', '0705');
insert into `tb_direction` values ('070502', '(N) F3 VZ', '0705');
insert into `tb_direction` values ('070503', '(N) F5 VZ', '0705');
insert into `tb_direction` values ('070504', '(N) F2 VS', '0705');
insert into `tb_direction` values ('070505', '(N) F3 VS', '0705');
insert into `tb_direction` values ('070506', '(N) F5 VS', '0705');

insert into `tb_direction` values ('0706', '怠速舒适性-支撑', '07');
insert into `tb_direction` values ('070601', '(Square&Lab) P Ohne AC', '0706');
insert into `tb_direction` values ('070602', '(Square&Lab) P mit AC', '0706');
insert into `tb_direction` values ('070603', '(Square&Lab) R Ohne AC', '0706');
insert into `tb_direction` values ('070604', '(Square&Lab) R mit AC', '0706');
insert into `tb_direction` values ('070605', '(Square&Lab) D Ohne AC', '0706');
insert into `tb_direction` values ('070606', '(Square&Lab) D mit AC', '0706');
insert into `tb_direction` values ('070607', '(Square&Lab) N Ohne AC', '0706');
insert into `tb_direction` values ('070608', '(Square&Lab) N mit AC', '0706');

insert into `tb_direction` values ('0707', '启停-支撑', '07');
insert into `tb_direction` values ('070701', '(Squar) SS', '0707');
insert into `tb_direction` values ('070702', '(Squar) SS_A', '0707');
insert into `tb_direction` values ('0708', 'stucken-支撑', '07');
insert into `tb_direction` values ('070801', '(N) Stuckern 40-80', '0708');
insert into `tb_direction` values ('070802', '(N) Stuckern 50', '0708');
insert into `tb_direction` values ('070803', '(N) Stuckern 70', '0708');

insert into `tb_direction` values ('0709', '隔振率-支撑', '07');
insert into `tb_direction` values ('070901', '(N) F2 VZ', '0709');
insert into `tb_direction` values ('070902', '(N) F3 VZ', '0709');
insert into `tb_direction` values ('070903', '(N) F5 VZ', '0709');
insert into `tb_direction` values ('070904', '(N) F2 VS', '0709');
insert into `tb_direction` values ('070905', '(N) F3 VS', '0709');
insert into `tb_direction` values ('070906', '(N) F5 VS', '0709');

insert into `tb_direction` values ('0710', '全局运行模态', '07');
insert into `tb_direction` values ('071001', '(N) BF', '0710');

insert into `tb_direction` values ('0711', '底盘舒适性', '07');
insert into `tb_direction` values ('071101', 'Stuckern 40-80', '0711');
insert into `tb_direction` values ('071102', 'rough concrete 30', '0711');
insert into `tb_direction` values ('071103', 'rough concrete 50', '0711');
insert into `tb_direction` values ('071104', 'Fahrwerk3_10', '0711');
insert into `tb_direction` values ('071105', 'Fahrwerk3_40', '0711');
insert into `tb_direction` values ('071106', 'Fahrwerk3_70', '0711');
insert into `tb_direction` values ('071107', 'Speedbumper_10', '0711');
insert into `tb_direction` values ('071108', 'Speedbumper_20', '0711');
insert into `tb_direction` values ('071109', 'Speedbumper_30', '0711');

insert into `tb_direction` values ('0712', '方向盘Tilger(整车)', '07');
insert into `tb_direction` values ('071201', '(N) F3 VZ', '0712');
insert into `tb_direction` values ('071202', '(N) F4 VZ', '0712');
insert into `tb_direction` values ('071203', '(N) F3 VS', '0712');
insert into `tb_direction` values ('071204', '(N) F4 VS', '0712');

insert into `tb_direction` values ('0713', '传动轴(整车)', '07');
insert into `tb_direction` values ('071301', '(N) F2 VZ', '0713');
insert into `tb_direction` values ('071302', '(N) F3 VZ', '0713');
insert into `tb_direction` values ('071303', '(N) F5 VZ', '0713');
insert into `tb_direction` values ('071304', '(N) F2 VS', '0713');
insert into `tb_direction` values ('071305', '(N) F3 VS', '0713');
insert into `tb_direction` values ('071306', '(N) F5 VS', '0713');