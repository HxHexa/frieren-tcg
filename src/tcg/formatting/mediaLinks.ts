const characterPortraits = {
  denkenPortrait:
    "https://static.wikia.nocookie.net/frieren/images/5/5c/Denken_anime_portrait.png/revision/latest?cb=20240112114340",
  edelPortrait:
    "https://static.wikia.nocookie.net/frieren/images/a/ab/Edel_anime_portrait.png/revision/latest?cb=20240119235404",
  fernPortrait:
    "https://static.wikia.nocookie.net/frieren/images/6/65/Fern_anime_portrait.png/revision/latest?cb=20231017083448",

  frierenPortrait:
    "https://media.discordapp.net/attachments/1346555621952192522/1347399695521026109/Frieren_anime_portrait.webp?ex=67dcd2c0&is=67db8140&hm=0b5f32d66153c8b41d2817170b41b7562e6ef607e9efb1abc220fe5905b7bd77&=&format=webp&width=600&height=600",
  himmelPortrait:
    "https://static.wikia.nocookie.net/frieren/images/9/96/Himmel_anime_portrait.png/revision/latest?cb=20231017083515",
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
    "https://images-ext-1.discordapp.net/external/T8sKlCzZxYVznbr_nMT7c2GR556S5JQs-2NGeGiSm9Q/%3Fcb%3D20240112114604/https/static.wikia.nocookie.net/frieren/images/4/43/%25C3%259Cbel_anime_portrait.png/revision/latest?format=webp&width=375&height=375",
  wirbelPortrait:
    "https://static.wikia.nocookie.net/frieren/images/d/da/Wirbel_anime_portrait.png/revision/latest?cb=20240112114401",
  flammePortrait:
    "https://static.wikia.nocookie.net/frieren/images/0/09/Flamme_anime_portrait.png/revision/latest?cb=20231017083418",
} as const;

const vangerisuCards = {
  frierenVangerisuCard:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588253721297007/Frieren_Card_2.png?ex=67e97971&is=67e827f1&hm=84a89d623d2339ff4ff198d0955843a692a39a9154aeee00e03f027eea19e2e6&",
  seinVangerisuCard:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035306840096848/Sein_Card.png?ex=67e02fd3&is=67dede53&hm=53829f9cd04a268eb8b6f9dba932220e814be02c9c6f6e76f61ab83e6c20c24d&",
  serieVangerisuCard:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873013695086602/Serie_Card.png?ex=67df98ad&is=67de472d&hm=fb33f3e38ac8fe90be812b86b7f85ab8a9e95f0303eed56c18f362f6a981fe4c&",
} as const;

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
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364282397381890069/GIF_0344215957.gif?ex=68091a7e&is=6807c8fe&hm=6c01215ed6985660a179640f2ed6e22c82e73adc4c581861829f5d4a9b9bc8e8&",
  ordinaryDefensiveMagic_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255554470018/Ordinary_Defensive_Magic.png?ex=67e97971&is=67e827f1&hm=6e44ae1f09dc7b05f29ddb6a646f9852692ff2427e333e1c0c4562c296918ce9&",
  ordinaryDefensiveMagic_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364275430797873243/GIF_0437404717.gif?ex=68091401&is=6807c281&hm=1f7c1e031326058f4b6d1d45cb7fc27361d2d63f142449411a1f8ff4b5f14f85&",
  heightOfMagic_image:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254866473161/The_Height_of_Magic.png?ex=67e97971&is=67e827f1&hm=0bddcf6c49f763947308ba3e63c58a8727730a9af0ff9c0175e948af704e29b3&",
  heightOfMagic_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364284928543424652/GIF_0512568585.gif?ex=68091cda&is=6807cb5a&hm=fa96e7031f374a6a962522623b61e81a53133ba49d57583e77d483e379a31edf&",
} as const;

const senseCardLinks = {
  sense_hairBarrier_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364942857307295905/GIF_0653594382.gif?ex=680b8198&is=680a3018&hm=368a1918766556e47cc2e4692113d174afa955d6f59f3206d2f0cb6269df4a34&",
  sense_teaTime_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364949044656607232/GIF_0807192060.gif?ex=680b875b&is=680a35db&hm=ced86d0c723bc4d139d0012c97a29d89d6fad79d084e1607036211869d17b57e&",
  sense_teaParty_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364992405018902568/GIF_0507169428.gif?ex=680c587d&is=680b06fd&hm=dd2441c0af97bd72ee4c6ee262830ce4a418d07197f696bae7bb832202d6498c&",
  sense_piercingDrill_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1364943023678427196/GIF_3233937113.gif?ex=680b81c0&is=680a3040&hm=07d5b41617b811cd069cc08f1de64d9966b4d03df7936844262be5f6ee25e0cb&",
} as const;

const stilleCardLinks = {
  stille_hide_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374730977061900400/GIF_1220750973.gif?ex=6839a97e&is=683857fe&hm=efca39e0b8ca3e13ee37c77ea4083ff5b64924dd1d20a51eb4321dc949d6dd19&",
  stille_ironFeather_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374730934217216103/GIF_3381206608.gif?ex=6839a973&is=683857f3&hm=a0177cee8d1ab09c0845af7b7e64d53a5244b1e970491bdd21a00641f5bb782a&",
  stille_roost_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1374730994883629129/GIF_0977172306.gif?ex=6839a982&is=68385802&hm=3f3f42fb23a8d5da61241b0602d5de629f7b460f1cba0d898758bd7aa2105939&",
  stille_flyAway_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1361940199583780864/IMG_3171.gif?ex=6807d567&is=680683e7&hm=55cb8759a21dc4e1d852861c8856dd068b299cb289a109cd4be8cdd27cca4e2f&",
} as const;

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
  flamme_theoryofSouls_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378471920546087002/IMG_6826.gif?ex=683cb984&is=683b6804&hm=d837cdeef81def136a5379af313be932d5d00cafd3d96a01a9031cc01d9a27ac&",
  flamme_milleniumBarrier_gif:
    "https://cdn.discordapp.com/attachments/1360969158623232300/1378507554509946911/GIF_2872451178.gif?ex=683cdab4&is=683b8934&hm=b2bc1a80599ea2daed73e9f475afd1707dbb56ef13da049afc4d29b266d4ea83&",
};

const mediaLinks = {
  ...characterPortraits,
  ...vangerisuCards,

  ...edelCardLinks,
  ...flammeCardLinks,
  ...frierenCardLinks,
  ...senseCardLinks,
  ...stilleCardLinks,
  ...wirbelCardLinks,
} as const;

export default mediaLinks;
