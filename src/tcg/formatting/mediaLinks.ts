const characterPortraits = {
  auraPortrait:
    "https://static.wikia.nocookie.net/frieren/images/a/ac/Aura_anime_portrait.png/revision/latest?cb=20231017083323",
  denkenPortrait:
    "https://static.wikia.nocookie.net/frieren/images/5/5c/Denken_anime_portrait.png/revision/latest?cb=20240112114340",
  edelPortrait:
    "https://static.wikia.nocookie.net/frieren/images/a/ab/Edel_anime_portrait.png/revision/latest?cb=20240119235404",
  fernPortrait:
    "https://static.wikia.nocookie.net/frieren/images/6/65/Fern_anime_portrait.png/revision/latest?cb=20231017083448",
  flammePortrait:
    "https://static.wikia.nocookie.net/frieren/images/0/09/Flamme_anime_portrait.png/revision/latest?cb=20231017083418",
  frierenPortrait:
    "https://media.discordapp.net/attachments/1346555621952192522/1347399695521026109/Frieren_anime_portrait.webp?ex=67dcd2c0&is=67db8140&hm=0b5f32d66153c8b41d2817170b41b7562e6ef607e9efb1abc220fe5905b7bd77&=&format=webp&width=600&height=600",
  himmelPortrait:
    "https://static.wikia.nocookie.net/frieren/images/9/96/Himmel_anime_portrait.png/revision/latest?cb=20231017083515",
  kanneLawineImage:
    "https://cdn.discordapp.com/attachments/1051154628336681021/1424616313447256144/Screenshot202025-10-0620at2012.png?ex=68e498d5&is=68e34755&hm=bb50d51444375674c6e3e9cf98c7751daec78847b3b717e3ed6b19a14b687b77",
  laufenPortrait:
    "https://cdn.discordapp.com/attachments/1346555621952192522/1346694607467184179/Laufen_anime_portrait.webp?ex=67dce516&is=67db9396&hm=c8439cdb36a948bfa707b18d46177518aac79300021391b77791d2ba30985947&",
  liniePortrait:
    "https://cdn.discordapp.com/attachments/1346555621952192522/1347897148330606643/Linie_anime_portrait.webp?ex=67dca7ca&is=67db564a&hm=5cf66096e541bb9495c1e5749765f31c013a3644e20e04f7fd0ce9e87dcb8b03&",
  methodePortrait:
    "https://static.wikia.nocookie.net/frieren/images/f/f5/Methode_anime_portrait.png/revision/latest?cb=20240213200512",
  seinPortrait:
    "https://cdn.discordapp.com/attachments/1346555621952192522/1347898000717910057/Sein_anime_portrait.webp?ex=67dca896&is=67db5716&hm=ce78236ebb64724705c48a5221039f22e546cd1c9f940aa0036003b8bc74e49b&",
  sensePortrait:
    "https://cdn.discordapp.com/attachments/1346555621952192522/1347401422655983676/Sense_anime_portrait.webp?ex=67dcd45c&is=67db82dc&hm=ce49cf1681d25f349fa302868b4a0839e178f7c6f9153e694637e6162110fb2d&",
  seriePortrait:
    "https://cdn.discordapp.com/attachments/1346555621952192522/1347746220025577511/Serie_anime_portrait.webp?ex=67dcc3fa&is=67db727a&hm=7207f7eb67d49a3ce4bcf6cd0e06128d4e4fe21d53a5c4d47f532162d247dd3f&",
  starkPortrait:
    "https://cdn.discordapp.com/attachments/1346555621952192522/1346693056841388042/Stark_anime_portrait.webp?ex=67dce3a5&is=67db9225&hm=3098cd00290ea8e0d5fe1ce948f16bc4d93890d85ac5bd3e2d27e4397809af3a&",
  stillePortrait:
    "https://cdn.discordapp.com/attachments/1346555621952192522/1347746124936646756/Stille_EP18.webp?ex=67dcc3e4&is=67db7264&hm=2b4045f648e23094cc5011390d138a4e350471c86533dc7ec07a1d4b34c684f2&",
  ubelPortrait:
    "https://static.wikia.nocookie.net/frieren/images/4/43/%C3%9Cbel_anime_portrait.png/revision/latest?cb=20240112114604",
  wirbelPortrait:
    "https://static.wikia.nocookie.net/frieren/images/d/da/Wirbel_anime_portrait.png/revision/latest?cb=20240112114401",
} as const;

const vangerisuCards = {
  frierenVangerisuCard:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588253721297007/Frieren_Card_2.png?ex=67e97971&is=67e827f1&hm=84a89d623d2339ff4ff198d0955843a692a39a9154aeee00e03f027eea19e2e6&",
  seinVangerisuCard:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035306840096848/Sein_Card.png?ex=67e02fd3&is=67dede53&hm=53829f9cd04a268eb8b6f9dba932220e814be02c9c6f6e76f61ab83e6c20c24d&",
  serieVangerisuCard:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873013695086602/Serie_Card.png?ex=67df98ad&is=67de472d&hm=fb33f3e38ac8fe90be812b86b7f85ab8a9e95f0303eed56c18f362f6a981fe4c&",
} as const;

const auraCardLinks = {
  aura_rustedBlades_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981297963270236/IMG_7417.gif?ex=6887565d&is=688604dd&hm=65e62c78f01767b7fde87129fc98439c7a3e2d299473f3033c88ac26038ac61f&",
  aura_weatheredShields_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981307265974323/IMG_7422.gif?ex=6887565f&is=688604df&hm=f5593737109073d03acd1bd94b870d52d00557605fa62c8d34c5af3929a6c4f5&",
  aura_brokenArrows_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981294951759882/IMG_7409.gif?ex=6887565c&is=688604dc&hm=a6036e3d9f81ef1f86ed65ca36cd5e51f8d6b2223dac83648a99051084846220&",
  aura_fallenEmpire_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981295413137458/IMG_7410.gif?ex=6887565c&is=688604dc&hm=01ae7326b65b9a9c56fb2354b6e41db6e6229e66fa823fcb38b4b3e515fed488&",
  aura_rot_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981299309379634/IMG_7420.gif?ex=6887565d&is=688604dd&hm=9f78a0a0d00252a5b2d040eacea1932f4c0e48f7d3e49e6e0af43bd5062b75dd&",
  aura_immortalWall_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981298420187268/IMG_7418.gif?ex=6887565d&is=688604dd&hm=f48e459064a30993ac6a53aedc773e5c768f2352f755da1fe6f01ae372f074ed&",
  aura_retreat_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981296499200021/IMG_7414.gif?ex=6887565c&is=688604dc&hm=b1e225b447f0527033dae643b6ec209f3be1df358cc45f2277dce4f2632f5962&",
  aura_guillotine_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981298806329374/IMG_7419.gif?ex=6887565d&is=688604dd&hm=5f1b3cbd20d2e8f364ecbac56568574c6382c0b2bedd03151ae4b5f4a2b771b9&",
  aura_heartpiercer_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981295954198528/GIF_2958617706.gif?ex=6887565c&is=688604dc&hm=75109ae5672c22f1db8c12818423fb59dc29aa7374a9d25b96c1e7a1ccc9519b&",

  aura_auserlese_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981297501638747/IMG_7416.gif?ex=6887565d&is=688604dd&hm=47c2979272400a9a2a170b5deaa219994faf2bb28759e237a1130a04b9f1efc1&",
  aura_auserleseContextShifted_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398981297065558026/IMG_7415.gif?ex=6887565d&is=688604dd&hm=695bc83bfa99fe8c57cd470363e87e78c02729fa3a550d910493c2216ecd1a83&",

  // update these later
  aura_stolenValor_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398992141392547840/IMG_7424-ezgif.com-optimize1.gif?ex=68876076&is=68860ef6&hm=db79eb23db02cafb113e710076ae724920da397deab12631b1bbd50fb192b0bb&",
  aura_auserleseSucceeded_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398992140578590780/IMG_7424-ezgif.com-optimize.gif?ex=68876076&is=68860ef6&hm=9ce48209b8825756ca48c38b6b0bfa04dcb4c65e5bdc5eccc4f4d9591ff1d1dc&",
  aura_auserleseFailed_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1398989032825815040/IMG_7427.gif?ex=68875d91&is=68860c11&hm=3568234b9eabaa5a06ea25a70b0baa412e3113633f4b774271db70d8a5f8a73c&",
} as const;

const denkenCardLinks = {
  denken_uppercut_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364978489035460708/GIF_0836074812.gif?ex=680c4b87&is=680afa07&hm=84fd66beff9352aba9c037ff66d2b0e69219b34c0e3c9c5e62edbf96dc62a0f8&",
  denken_waldgose_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364217876323500123/GIF_0112106003.gif?ex=6808de67&is=68078ce7&hm=53339631d41657c84bff7858a0d4ca127e5dd726db694b68d34f5d833a75c8ba&",
  denken_daosdorg_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364218009102581871/GIF_4214490964.gif?ex=6808de87&is=68078d07&hm=dedf596f960aafe344c5eedec122d4dbd54c3b5c6f8b002b3cae75da891fdedf&",
  denken_catastravia_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364218121669316608/GIF_1295476803.gif?ex=6808dea2&is=68078d22&hm=bdc2fd9b990ddf12a7cb0d6ad7b24dca2a24203773cd3896f0c53681dad85ed9&",
  denken_defensive_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1396618395390050357/GIF_3626846158.gif?ex=687f667d&is=687e14fd&hm=0adf53c2354f5aaedbf33907ee36d9ea632d755d78704688a8d0d58f7322ea7d&",
  denken_noPlaceToGiveUp_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364979223357296802/GIF_0406490421.gif?ex=680c4c36&is=680afab6&hm=cf5c0f9d7e3e14ec143a8b304c0d416868db25cb8de5a1f0b38cc4c7507df73d&",
};

const edelCardLinks = {
  edel_kneel_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374486346898345984/IMG_6695.gif?ex=68396e69&is=68381ce9&hm=317835f24a90eb7a73e8c7ea601dd9d190e82cb74c33e0265179914a249734aa&",
  edel_telekinesis_gif:
    "https://media.discordapp.net/attachments/1367328754795286599/1368285080606347444/Stone_hurling_spell_EP24.gif?ex=6817aa48&is=681658c8&hm=b41474c8c6b45cfcf6d65a0d1f5586e9633d1d064f0ee1ab4facd0d9b3699a84",
  edel_mental_fog_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374497391608070154/IMG_6697.gif?ex=683978b3&is=68382733&hm=61b9c7230060e8b56e81bdb9802e6af68ee6d270d8364a55ad5084fefa4eca72&",
  edel_clear_mind_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374729135372632084/GIF_3709745143.gif?ex=6839a7c7&is=68385647&hm=1e0ff2c68dc5869471ac969c2c5050d96d76dcceac26e711827a1615138ba618&",
};

const fernCardLinks = {
  fern_zoltraak_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364355690780557404/GIF_4110295150.gif?ex=680a0781&is=6808b601&hm=4aa279af5d5b3ae167099775570328a51c55d8572aac6369a9748565b950f8a1&",
  fern_barrage_gif: "https://c.tenor.com/2RAJbNpiLI4AAAAd/tenor.gif",
  fern_concentratedZoltraakSnipe_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364357151111385098/GIF_1619936813.gif?ex=6809601d&is=68080e9d&hm=d315925c27f678c96ed238bcc826abd1c209e5e1dae651b445b7fa4760e0cf09&",
  fern_disapproving_pout_gif: "https://c.tenor.com/V1ad9v260E8AAAAd/tenor.gif",
  fern_spellToCreateManaButterflies_gif:
    "https://c.tenor.com/B93aR7oWJ4IAAAAC/tenor.gif",
  fern_commonDefensiveMagic_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364255159529767005/GIF_2894655091.gif?ex=68090120&is=6807afa0&hm=e81b702e207fea882babeffd4b376e8db66a1afac7b19191892b3e6e29a9772c&",
  fern_manaConcealment_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410794238576431124/ezgif-342f2b9133a610.gif?ex=68b25005&is=68b0fe85&hm=800bb754dd978b75f4e6915a72361c3509ae6536b24638dc4e6123d7e342002e",
  fern_manaDetection_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1411852717592150107/ezgif-8798439f839874.gif?ex=68b8240e&is=68b6d28e&hm=2edb4baf768a83cd6dbc36bb361458a037095bb0f9bad30eee495d9cecd9b70c",
};

const flammeCardLinks = {
  flamme_fieldOfFlower_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378365073780903966/GIF_1700041363.gif?ex=683c5602&is=683b0482&hm=6283ea064ff706029f5b86bb1c339b9c1523e05b5aef0428a53919b5eb02a1b3&",
  flamme_flammesNotes_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378365347987591280/GIF_1360657389.gif?ex=683c5643&is=683b04c3&hm=cf4ecdb77666383ef27ec4a8e9f2037c20d451a541ae491ffec5aeee7e7037e4&",
  flamme_treeOfLife_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378383008490324131/GIF_0325338485.gif?ex=683c66b6&is=683b1536&hm=562c173fc7ca82e93ee4ca409c850979dd377fec0860a49594bc7bba0070c1dd&",
  flamme_sanctuary_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378383622318592072/GIF_0295228606.gif?ex=683c6748&is=683b15c8&hm=e68662933a2ce8c0f5c4f8a6ec1ee382231dc520b70a31558636f592c3684120&",
  flamme_seduction_gif: "https://c.tenor.com/EC6mBMhIRugAAAAC/tenor.gif",
  flamme_theory_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378420857839554651/GIF_0406338443.gif?ex=683c89f6&is=683b3876&hm=9a8cdeafacbf67abd81c32ecbb32a415dec4c65e78654cf2eb11c40802d80df0&",
  flamme_theory2_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378714935177252874/IMG_6840.gif?ex=6856a857&is=685556d7&hm=1d1398f7b7a49a35d92226381d8994dd668c4119cfd4f0c6a1033045da2de895&",
  flamme_theoryofSouls_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378471920546087002/IMG_6826.gif?ex=683cb984&is=683b6804&hm=d837cdeef81def136a5379af313be932d5d00cafd3d96a01a9031cc01d9a27ac&",
  flamme_milleniumBarrier_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378507554509946911/GIF_2872451178.gif?ex=683cdab4&is=683b8934&hm=b2bc1a80599ea2daed73e9f475afd1707dbb56ef13da049afc4d29b266d4ea83&",
  flamme_pinnacle_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1407522765065687131/Record_2025_06_13_21_43_43_805.gif?ex=68a66939&is=68a517b9&hm=ba6f8a983736b4a1193b246c5b8421f3f0c1ae11be9cfb6374b1d777470bb70d",
};

const frierenCardLinks = {
  zoltraak_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588256267501888/Offensive_Magic_Analysis_Zoltraak.png?ex=67e97971&is=67e827f1&hm=193fb4668269bd8509f7b4ce4a092c12af7b44ac8fd5264dfac08c5da5a349bf&",
  zoltraak_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364283548789379163/GIF_2604048789.gif?ex=68091b91&is=6807ca11&hm=a7fd85473cc4a8c441193bd990c6517e95d5cc6789023f530c27f4d21e5e70dc&",
  fieldOfFlowers_gif: "https://c.tenor.com/Sd_BDB5kVZ8AAAAd/tenor.gif",
  fieldOfFlowers_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255269130370/Spell_to_make_a_field_of_flowers_New.png?ex=67e97971&is=67e827f1&hm=b03c906280c5f4f09d212bae40f29b671377145e137dbfe5f4d5da93be130dd7&",
  fieldOfFlowers_image_old:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873016660590653/Spell_to_make_a_field_of_flowers_4.png?ex=67df98ae&is=67de472e&hm=e5080e39c9818eee5f9a3d559a829b6f3ecab15be85b9897fb6c28ea27c6e674&",
  judradjim_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588256728748365/Destructive_Lightning_Analysis_Judradjim.png?ex=67e97972&is=67e827f2&hm=15cd0d0ef4df4a3d1559b405c3e8843ecbda4b64b349e2149fb9d22db3c5e817&",
  judradjim_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364225378952020029/GIF_1668382682.gif?ex=6808e564&is=680793e4&hm=2c769b1580a0639d7e83a046cad25ff641b839f91ab7c035b0ae844aae3b551c&",
  vollzanbel_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255923572736/Hellfire_Summoning_Vollzanbel.png?ex=67e97971&is=67e827f1&hm=c31d35c7ce7820b3d386f7f3119f463538d83576ad2a4f0ed2a83370390ce87c&",
  vollzanbel_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364225342218309674/GIF_1142333080.gif?ex=6808e55b&is=680793db&hm=11bd4be532ecf85eab598b0533e6c5b747d9bb8483c74ec2a86f3ede0fb352aa&",
  barrierAnalysis_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254463951029/Barrier_Magic_Analysis.png?ex=67e97971&is=67e827f1&hm=d65bb623550e93604fbedbc80cb6638c52b8ead8f1a70114e410a52df1260605&",
  barrierAnalysis_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364275399940378707/GIF_1207512349.gif?ex=680913fa&is=6807c27a&hm=5a7ddf666a159597f0d6978040ba415d4e8e02fca6413ee098f673be9207d099&",
  demonAnalysis_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254107439245/Demon_Magic_Analysis.png?ex=67e97971&is=67e827f1&hm=8318bc5d0892f966e0bc07d29fd6042ab37cc93cdc86a3d58feb438631b3b354&",
  demonAnalysis_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410819493747363900/ezgif-55c34050eeb591.gif?ex=68b2678b&is=68b1160b&hm=89e359118a6cb57458fe4fb768648fa363bee9ccf13126bad57740c73a393136",
  ordinaryDefensiveMagic_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255554470018/Ordinary_Defensive_Magic.png?ex=67e97971&is=67e827f1&hm=6e44ae1f09dc7b05f29ddb6a646f9852692ff2427e333e1c0c4562c296918ce9&",
  ordinaryDefensiveMagic_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364275430797873243/GIF_0437404717.gif?ex=68091401&is=6807c281&hm=1f7c1e031326058f4b6d1d45cb7fc27361d2d63f142449411a1f8ff4b5f14f85&",
  heightOfMagic_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254866473161/The_Height_of_Magic.png?ex=67e97971&is=67e827f1&hm=0bddcf6c49f763947308ba3e63c58a8727730a9af0ff9c0175e948af704e29b3&",
  heightOfMagic_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364284928543424652/GIF_0512568585.gif?ex=68091cda&is=6807cb5a&hm=fa96e7031f374a6a962522623b61e81a53133ba49d57583e77d483e379a31edf&",
} as const;

const himmelCardLinks = {
  himmel_FrierenStrikeTheirWeakpoints_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1362092606695145482/GIF_1369578971.gif?ex=68086357&is=680711d7&hm=07c26c17a9a859865c2f107f8358b50df98cc49d49ed0daa2f659c6acb494f1e&",
  himmel_FrierenBackMeUp_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410557673702821941/ezgif-3a05216eb518f2.gif?ex=68b2c534&is=68b173b4&hm=65f7d528daebe39e8585fdd3bcb30feb7a2e4d36dd7ff7788336b5942e72884a",
  himmel_FrierenNow_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410791075135623210/ezgif-706e89a4a98ad0.gif?ex=68b24d13&is=68b0fb93&hm=ae40a671b2f4c4d5798e902e323579af96fd9dc7b2e8939ac5527290ea970c5f",
  himmel_EisenTheEnemysOpen_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410790058100916315/ezgif-7b7e60f0bc44bb.gif?ex=68b24c21&is=68b0faa1&hm=63eccdea3895383b7eec31ddf3638fa00c870fdfc445544bb8173718172c438e",
  himmel_EisenHoldTheLine_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410555753051459667/ezgif-36381c1c596a1a.gif?ex=68b2c36a&is=68b171ea&hm=3cae26acefefc785b091266af58b51c487e02b35d0581482a94d0d4579386764",
  himmel_extremeSpeed_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361210956872421497/IMG_3122.gif?ex=6807d13e&is=68067fbe&hm=3ac9b147ffc7c93d02121986546428f4b36f0bb08a2c8bc526d5ba51df5a4bd6&",
  himmel_realHerosSwing_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361777461620248576/GIF_1092034222.gif?ex=6807e697&is=68069517&hm=853f7d8910a4ab79010685a4399cd55c0af1f343295e0b2e04c49f829b54eee7&",
};

const laufenCardLinks = {
  laufen_staffStrike_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1365418943023681656/GIF_0570739142.gif?ex=681088bc&is=680f373c&hm=11d929f2c7b8bbc30b003a0d981cf02eb802b3651ba64f281ca1f5e0fa36b358&",
  laufen_staffBash_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1365418943023681656/GIF_0570739142.gif?ex=681088bc&is=680f373c&hm=11d929f2c7b8bbc30b003a0d981cf02eb802b3651ba64f281ca1f5e0fa36b358&",
  laufen_whip_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1365419009721499718/GIF_3626022317.gif?ex=681088cc&is=680f374c&hm=838847fac81db2afc9448524255aceece7c3015a4af205b3014cd79ba565380c&",
  laufen_supersonicStrike_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1366373963789242388/GIF_0816288304-ezgif.com-optimize.gif?ex=6810b66a&is=680f64ea&hm=04b17a787656912d7075211221d149c8eaca57ca5ca916c27ab634fedaa75fb0&",
  laufen_hide_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1365422814097707120/GIF_3467240538.gif?ex=68108c57&is=680f3ad7&hm=afdbfcbce169548db1583e2f07027c57cf975b395500daee05e77e21a6b96b48&",
  laufen_quickDodge_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1365419393307377684/GIF_1047990200.gif?ex=68108927&is=680f37a7&hm=f99fc20e4da10efce076e95809cf6f4349da36e3fdd8600003877c1589a37ea6&",
  laufen_parrry_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1365423837218472137/GIF_2008541989.gif?ex=68108d4b&is=680f3bcb&hm=886ee4f02a75662b1f11b3b64fbe46edada132bdffb20d022907d8df3ba15a33&",
  laufen_jilwer_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1363008456306725004/Jilwer.gif?ex=6807c3cb&is=6806724b&hm=21c109a6e16515d4ee652bb3d730625a7dda49bacb56ad286a0b303d39c26d72&",
};

const linieCardLinks = {
  linie_adapt_gif: "https://c.tenor.com/Dcc6-Rvkts8AAAAd/tenor.gif",
  linie_imitate_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1411859931195244574/ezgif-838754d1165525.gif?ex=68b82ac6&is=68b6d946&hm=d6980e7d3098a5fcd3392b47990efc62f7b8b1696ece8024bf593bf9519e1e2c",
  linie_erfassenAxe_gif: "https://c.tenor.com/eUCHN11H4B4AAAAd/tenor.gif",
  linie_erfassenJavelin_gif: "https://c.tenor.com/zd9mOGFjT3IAAAAd/tenor.gif",
  linie_erfassenSword_gif: "https://c.tenor.com/f4-8FBCgXg4AAAAd/tenor.gif",
  linie_erfassenKnife_gif:
    "https://cdn.discordapp.com/attachments/1374120144334487703/1383218233544544458/Record_2025_06_13_23_54_18_400.gif?ex=68568f9d&is=68553e1d&hm=5e505d4f193dee45cac1df4b52c54a27704a1638746127ae282a2559d4f74d4a&",
};

const methodeCardLinks = {
  methode_reversePolarity_gif:
    "https://cdn.discordapp.com/attachments/1374120144334487703/1383220242444193833/Record_2025_06_14_00_01_59_586.gif?ex=686317bc&is=6861c63c&hm=ab9cf6576651efac8e246f52bd08cec46713fc8181e71c6d6a97f2ec93349ba3&",
  methode_goddessMagic_gif:
    "https://cdn.discordapp.com/attachments/1374120144334487703/1383221519039201370/Record_2025_06_14_00_07_38_188.gif?ex=686318ed&is=6861c76d&hm=bfcb7dc7cb601bdcea70bd7781a8c568ca435a4319796426b75993c105a81328&",
  methode_restraintMagic_gif:
    "https://cdn.discordapp.com/attachments/1374120144334487703/1383223333168087071/Record_2025_06_14_00_15_00_71.gif?ex=68631a9d&is=6861c91d&hm=73bb6e7882ab63e19e31b46e8a7551b858eae0f7771a59b7759f5c4df694d73a&",
  methode_piercing_gif: "https://c.tenor.com/q7ffBv9OS-sAAAAd/tenor.gif",
  methode_hypnoticCompulsion_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1396618033866211438/GIF_2404385183.gif?ex=687f6627&is=687e14a7&hm=c388e026d5468bbe089a941b13da3fddcedc02a9460bece2c3d3c210c40e9160&",
};

const seinCardLinks = {
  sein_frierensZoltraak_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035311357362268/Trust_in_your_Ally_Frierens_Zoltraak_1.png?ex=67e02fd4&is=67dede54&hm=6cb8d375f497cf7bca2637de8d70a900901116aa53f0b0aa3e977ddc27a5def8&",
  sein_frierensZoltraak_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361022845664104740/GIF_0907854706.gif?ex=6807cacc&is=6806794c&hm=c4c3d7908005bbcd23defb42f4c9b756135c8a5c1726330d0a52495998ec2c53&",
  sein_fernsBarrage_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035310996394024/Trust_in_your_Ally_Ferns_Barrage.png?ex=67e02fd4&is=67dede54&hm=57cae7a03eefb0dacaa8649910e48ab411d50ca94a9855b078098e751b92ae75&",
  sein_fernsBarrage_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361022927788834966/GIF_2294206836.gif?ex=6807cae0&is=68067960&hm=ca32887d358b3c43ad2d4c5618373b8cab1a11d0acdcc496a7203544936a9244&",
  sein_starksLightningStrike_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035310677622845/Trust_in_your_Ally_Starks_Lightning_Strike.png?ex=67e02fd4&is=67dede54&hm=608a0bc2795f44b1512ecb7d26b29213aedada2f9f9db64b178447be0dd98476&",
  sein_mugOfBeer_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353038477805228073/Mug_of_Beer_2.png?ex=67e032c7&is=67dee147&hm=9e453e019c32d60027135834549e42bd19f16995569570a3012b9626a5fdf6f4&",
  sein_mugOfBeer_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361017071886012681/GIF_3575013087.gif?ex=6807c56c&is=680673ec&hm=1e20739be8a75140974b9babb65729cf83c31d4f3d991bc35c90207fda41cd34&",
  sein_smokeBreak_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035309906133052/Smoke_Break.png?ex=67e02fd4&is=67dede54&hm=a6eaadebd1ce83f74e2819c16eb7cb57e8fb0f9888f8083248ac49b54119ccf4&",
  sein_smokeBreak_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361017954392866997/3.2.1.sein.gif?ex=6807c63e&is=680674be&hm=110488d337d86b35ac2b84cfec08e01c070a3ecb4563ccdfb3c1df602c5249f9&",
  sein_awakening_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035309436375121/Awakening.png?ex=67e02fd3&is=67dede53&hm=48c7275f912f8927990fa0073b3f8a6c2e7279042e5bd8edfe1a925261a0e5b5&",
  sein_awakening_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361016482263208137/GIF_1188387197.gif?ex=6807c4df&is=6806735f&hm=f5ed7c521144db3412cf1a52b1417497950c1adf96d45301ff7421b5a75d8ca7&",
  sein_poisonCure_image:
    "https://media.discordapp.net/attachments/1351391350398128159/1353035308844974100/Poison_Cure.png?ex=67e02fd3&is=67dede53&hm=76216578c19115f3ddcd9bff1c497b0c7c2f9ee87152f02c4085d681dd0dc6ae&=&format=webp&quality=lossless&width=908&height=1160",
  sein_poisonCure_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361016416488390776/GIF_0966802288.gif?ex=6807c4d0&is=68067350&hm=2d09267ccc0505a949b0c57e6c9bb84fc99decb89d35637cadced435723f5904&",
  sein_braceYourself_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035308182147102/Brace_Yourself.png?ex=67e02fd3&is=67dede53&hm=b4bcacc46cae5fcd120b76d666ef606186621d3edc230a851e09a77976fce8eb&",
  sein_braceYourself_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364568772136140810/GIF_1787578930.gif?ex=680a2533&is=6808d3b3&hm=1cfb307428d03155177b0ce8439cc92792a63fc2588d8483cf618682105449a3&",
  sein_threeSpearsOfTheGoddess_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035307397681172/Three_Spears_of_the_Godess.png?ex=67e02fd3&is=67dede53&hm=671b75347795840779fe6e5007f8a0918b04e3b6a558b561ca9ce4b4c18694a8&",
  sein_threeSpearsOfTheGoddess_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1360972240732291242/GIF_0993654948.gif?ex=6808446b&is=6806f2eb&hm=90213c37d073b6d0b0354a3893d14b16c727fa9b04c457693110512a142c0338&",
};

const senseCardLinks = {
  sense_hairBarrier_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364942857307295905/GIF_0653594382.gif?ex=680b8198&is=680a3018&hm=368a1918766556e47cc2e4692113d174afa955d6f59f3206d2f0cb6269df4a34&",
  sense_teaTime_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364949044656607232/GIF_0807192060.gif?ex=680b875b&is=680a35db&hm=ced86d0c723bc4d139d0012c97a29d89d6fad79d084e1607036211869d17b57e&",
  sense_teaParty_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364992405018902568/GIF_0507169428.gif?ex=680c587d&is=680b06fd&hm=dd2441c0af97bd72ee4c6ee262830ce4a418d07197f696bae7bb832202d6498c&",
  sense_sharpen_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410816361139146762/ezgif-560c613873aa8f.gif?ex=68b264a0&is=68b11320&hm=cc0f023cfcc98ff0d8b7d88ff3c8d8874b8685810947dcb18c391c33159db280&",
  sense_hairWhip_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410816370459021312/ezgif-50866f211288be.gif?ex=68b264a2&is=68b11322&hm=8dfb0b65f4674a84460851ed0b0bccaaf3939545043daad2a3f39e69669a1ea2&",
  sense_pierce_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410816371646009434/ezgif-5bcbc05319edbf.gif?ex=68b264a2&is=68b11322&hm=9c8a943a9dc9b6738e012ceee85a8a9b8f8ac7c645d2e3351a14a15af3c2f208&",
  sense_piercingDrill_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364943023678427196/GIF_3233937113.gif?ex=680b81c0&is=680a3040&hm=07d5b41617b811cd069cc08f1de64d9966b4d03df7936844262be5f6ee25e0cb&",
} as const;

const serieCardLinks = {
  serie_livingGrimoireOffenseCommon_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014785740800/Living_Grimoire_1.png?ex=6808772d&is=680725ad&hm=96a1d24a30264ade70debfc8ffe00506330d2b9ed559386e1a69a1c19bc647e9&",
  serie_livingGrimoireOffenseRare_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873015121150022/Living_Grimoire1_1.png?ex=6808772d&is=680725ad&hm=903c0f575a5857d8527c631c5b4ef5fbf6ff9140ea44ea0a4f5ad7c6433a92a6&",
  serie_livingGrimoireOffenseUnusual_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873015825924147/Living_Grimoire2_1.png?ex=6808772e&is=680725ae&hm=63b0595c68a10b5d7c4246e4747f43fc61b292a95577b3c00b479ef11320ac58&",
  serie_livingGrimoireUtilityTactics_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014785740800/Living_Grimoire_1.png?ex=6808772d&is=680725ad&hm=96a1d24a30264ade70debfc8ffe00506330d2b9ed559386e1a69a1c19bc647e9&",
  serie_livingGrimoireUtilityRecovery_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014785740800/Living_Grimoire_1.png?ex=6808772d&is=680725ad&hm=96a1d24a30264ade70debfc8ffe00506330d2b9ed559386e1a69a1c19bc647e9&",
  serie_mock_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873015502966825/Mock_1.png?ex=67df98ae&is=67de472e&hm=b4bfad8c4a548745a18660e2fcb39e7927661f269b17f9f8c73b66fa780f3d04&",
  serie_basicDefensiveMagic_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014416506932/Basic_Defense_Magic.png?ex=67df98ad&is=67de472d&hm=79bab34bdef07e7fa529c5ac67ed093e7bfa2b69914f644ac434e4a564c47396&",
  serie_unbreakableBarrier_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873016182177984/Unbreakable_Barrier.png?ex=67df98ae&is=67de472e&hm=ecaf6053851a3bb12e9d9b0ba65dc932f11a6e97c3efe3c4af20126fc8407ba3&",
  serie_ancientBarrierMagic_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014080966718/Ancient_Barrier_Magic_1.png?ex=67df98ad&is=67de472d&hm=c0b00575790207a93d00398d3351e5cd914f371b0c2118855f8f2dc259634420&",
  serie_ancientBarrierMagic_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1365090141374513232/IMG_6559.gif?ex=680cb383&is=680b6203&hm=319be760a6a351a675a1f82ed84fc6cc78063ab4f302f01e5f00d677de814937&",
};

const starkCardLinks = {
  stark_axeSwipe_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361125002761605140/IMG_3109.gif?ex=680829f1&is=6806d871&hm=ae00597c479d370662a52ae4f04cb024103354b0c758c483ff09946a0c1288ec&",
  stark_offensiveStance_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361122664416018593/IMG_3106.gif?ex=680827c3&is=6806d643&hm=d6fdc758cc5b780bad809f674a6d3bf88f19ff038136bd96dca94e7c09ce18ed&",
  stark_defensiveStance_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1410537480138133594/ezgif-629a669183985e.gif?ex=68b2b265&is=68b160e5&hm=b7245d52cf6a21f23ff3207012f7f3141244ecec3411767bd7b7460fe8d5e603",
  stark_jumboBerrySpecialBreak_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1360990957671153826/IMG_3099.gif?ex=680855da&is=6807045a&hm=7b11f297c0dc63b3bd8e9e19d7b7cb316001a389454bd05213d99686879f4f3c&",
  stark_block_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1360996196788867283/IMG_3102.gif?ex=68085abb&is=6807093b&hm=0602a1a0ef9278e1544911aa3e5b873617d0ab8cdd84c958c62e94f162bfe111&",
  stark_concentration_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1360979639362781304/IMG_3087.gif?ex=68084b4f&is=6806f9cf&hm=98d20b75a63aca3116965b33fac4adac213feaefa4895cf0751976527dd483a0&",
  stark_ordensSlashTechnique_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361187449522356324/IMG_3119.gif?ex=68086419&is=68071299&hm=f010c6a8f3b17eb25cdb15c8605dfb69ea06a323b0ca5aaed2484cce741ed4e6&",
  stark_fearBroughtMeThisFar_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1360983005946183957/IMG_3091.gif?ex=68084e72&is=6806fcf2&hm=5e9453189ccb1c31a4def06862e8dc7d2468c471eff0f8faa63d6288c8127c6c&",
  stark_eisensAxeCleave_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361191191533719602/IMG_3110.gif?ex=68086795&is=68071615&hm=e80ebb6c7098f7f020cc5a67819287df12f6ea5fa9427231382b6a8b026f3e47&",
  stark_lastStand_gif: `[⠀](https://c.tenor.com/eHxDKoFxr2YAAAAC/tenor.gif)`,
};

const stilleCardLinks = {
  stille_hide_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374730977061900400/GIF_1220750973.gif?ex=6839a97e&is=683857fe&hm=efca39e0b8ca3e13ee37c77ea4083ff5b64924dd1d20a51eb4321dc949d6dd19&",
  stille_ironFeather_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374730934217216103/GIF_3381206608.gif?ex=6839a973&is=683857f3&hm=a0177cee8d1ab09c0845af7b7e64d53a5244b1e970491bdd21a00641f5bb782a&",
  stille_roost_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374730994883629129/GIF_0977172306.gif?ex=6839a982&is=68385802&hm=3f3f42fb23a8d5da61241b0602d5de629f7b460f1cba0d898758bd7aa2105939&",
  stille_flyAway_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361940199583780864/IMG_3171.gif?ex=6807d567&is=680683e7&hm=55cb8759a21dc4e1d852861c8856dd068b299cb289a109cd4be8cdd27cca4e2f&",
  stille_geisel_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364971079096995840/GIF_0867566819.gif?ex=680b9be1&is=680a4a61&hm=af689691d54884d9f7df5a639c214146c59d7b3a9a6b0e8547fb41cf6b914c6c&",
} as const;

const ubelCardLinks = {
  ubel_shallowSlash_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1406952351620665464/Untitled_video_7.gif?ex=68a6503c&is=68a4febc&hm=ccb3c85e6cca4b1287835360a5fa8421e4e2cf8fef095918270e2c1e8ea05081",
  ubel_cleave_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364386420554203196/GIF_3999614558.gif?ex=680a241f&is=6808d29f&hm=ed397e2ab4a3166d3e6975560d40d37d928ff1a6df755fabb56425cf283d0f89&",
  ubel_dismantle_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364758389111918673/GIF_1476107048.gif?ex=680b7e8b&is=680a2d0b&hm=28e6e00072ec765df91914cdea3090c0c582b5079a9ec977ca21a3f70be5aea0&",
  ubel_rushdown_gif:
    "https://media.discordapp.net/attachments/1360969158623232300/1364216562600509570/GIF_2060261812.gif?ex=6808dd2e&is=68078bae&hm=120ce38d9abf8a42357d0bd650f0e5c63da9ea2232bd5ceae2716ee67a2fb67f&=&width=1440&height=820",
  ubel_slowDown_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364216703541837844/GIF_2189012353.gif?ex=6808dd50&is=68078bd0&hm=644b405b52a67b684bda6bfff12ce2ffa99d091de554b967213e07aa87883a8d&",
  ubel_defend_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364384151616094239/GIF_3928500915.gif?ex=680a2202&is=6808d082&hm=09e4cc493604c6e0be6f9a04263c49d93dd9a7d20bb18c78f6b58d1fd303c9b6&",
  ubel_sorganeil_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364748769165447188/GIF_3534737554.gif?ex=680b7596&is=680a2416&hm=97e22820e064efed4dc8688572fffad891c01cdaac28df0e7a8e0ca77661521c&",
  ubel_empathy_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364937614494535711/GIF_3999726425.gif?ex=680b7cb6&is=680a2b36&hm=8e54664c9778ca6cc49807519b9e0afd09dffa377209d98eb3c92f78c4ce1d1b&",
  ubel_malevolentShrine_gif:
    "https://media.discordapp.net/attachments/1338831179981262943/1363264315272073406/malevolent-shrine-ubel.gif?ex=68060f14&is=6804bd94&hm=300b3e5578f56a069ea858f0f660ce855be6a3f6f32f246b434066ea770da58e&=&width=400&height=225",
};

const wirbelCardLinks = {
  wirbel_concentratedZoltraakBolt_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1377705979642253352/GIF_1544925494.gif?ex=683a98ee&is=6839476e&hm=5dfc16e4cf0f4e50cb5507c8b721f7399558d0e24588f3d2c8e0c940636b5e7d&",
  wirbel_sorganeil_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1377705939737509979/GIF_3393146172.gif?ex=683a98e4&is=68394764&hm=a8b1636e7988d36ca7257d800c5ad254b3adac8605217c3a72cd703bce97f91a&",
  wirbel_tacticalRetreat_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1377705898667147426/GIF_2380761569.gif?ex=683a98da&is=6839475a&hm=54b23eca14ae00f5076190a89e4119fa7d93bdb2c5cd03ed9b8ecb6e838f6c1b&",
  wirbel_ehreDoragate_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378159519825137745/Doragate.gif?ex=683b9692&is=683a4512&hm=a91f7d7856742a37b9b07f09d16716dc8a2e28861d5341b639d10953e7162ca9&",
  wirbel_spearRush_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1377705828643115128/GIF_2399541750.gif?ex=683a98ca&is=6839474a&hm=24987e08dc3aeecfa0f3729bdf252acac2f236835f81ff8fc702c6ac90aedebd&",
  wirbel_jubelade_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378124835984507071/GIF_2194611837.gif?ex=683b7645&is=683a24c5&hm=59a1ddac5b8a79067a0bbbab32462850c302f3fc2043645fc3cda2b42020917f&",
  wirbel_captainsOrder_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378130084178694315/GIF_1598346001.gif?ex=683b7b28&is=683a29a8&hm=e06d2c3811dbcb30eb34d3641d01a7eba34dc248592a6ecf3069150b3c4ec69c&",
  wirbel_emergencyDefensiveBarrier_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378420634744520715/GIF_2221307157.gif?ex=683c89c1&is=683b3841&hm=ff9319b4c60221662111d74c362046307caffd0f9c6bc8025a63ebafa5f273bb&",
} as const;

const mediaLinks = {
  ...characterPortraits,
  ...vangerisuCards,

  ...auraCardLinks,
  ...denkenCardLinks,
  ...edelCardLinks,
  ...fernCardLinks,
  ...flammeCardLinks,
  ...frierenCardLinks,
  ...himmelCardLinks,
  ...laufenCardLinks,
  ...linieCardLinks,
  ...methodeCardLinks,
  ...seinCardLinks,
  ...senseCardLinks,
  ...serieCardLinks,
  ...starkCardLinks,
  ...stilleCardLinks,
  ...ubelCardLinks,
  ...wirbelCardLinks,
} as const;

export default mediaLinks;
