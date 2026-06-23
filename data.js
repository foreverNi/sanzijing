// 三字经全文 - 按两句一页组织
const threeCharClassic = [
  // ========== 第一部分：教育意义（已有） ==========
  {
    verse: "人之初，性本善",
    pinyin: "rén zhī chū, xìng běn shàn",
    story: "每个人刚出生的时候，本性都是善良的。就像一颗小小的种子，本来都有长成大树的潜力。宝宝刚出生时，心灵纯洁得像一张白纸，充满了对世界的好奇和爱。",
    moral: "善良是每个人天生就有的",
    animation: "baby-seed",
    bgColor: "#FFE8D6",
    accentColor: "#FF6B6B"
  },
  {
    verse: "性相近，习相远",
    pinyin: "xìng xiāng jìn, xí xiāng yuǎn",
    story: "人的本性本来差别不大，但后天的学习和环境会让人变得很不一样。就像两棵同样的小树苗，一棵在阳光雨露下长大，一棵在风吹雨打中生长，长大后就很不同了。所以好的学习环境很重要哦！",
    moral: "环境和学习改变人生",
    animation: "two-trees",
    bgColor: "#D4F1F4",
    accentColor: "#189AB4"
  },
  {
    verse: "苟不教，性乃迁",
    pinyin: "gǒu bù jiào, xìng nǎi qiān",
    story: "如果从小不好好教育，善良的本性就会慢慢改变。就像一块干净的布，如果不经常清洗，就会变脏。所以我们要好好学习，保持善良的心，不要让坏习惯影响我们哦！",
    moral: "不学习，本性会变坏",
    animation: "cloth-clean",
    bgColor: "#FFF2CC",
    accentColor: "#FFA500"
  },
  {
    verse: "教之道，贵以专",
    pinyin: "jiào zhī dào, guì yǐ zhuān",
    story: "教育的方法最重要的是专心致志。就像用放大镜聚焦阳光可以点燃纸一样，专注地做一件事才能成功。小朋友学习的时候要一心一意，不要一边玩一边学哦！",
    moral: "专心是学习的秘诀",
    animation: "magnifier",
    bgColor: "#E8D5FF",
    accentColor: "#7C3AED"
  },
  {
    verse: "昔孟母，择邻处",
    pinyin: "xī mèng mǔ, zé lín chǔ",
    story: "古时候有个叫孟子的人，他的妈妈为了让他有好的学习环境，搬了三次家。第一次住在墓地旁边，孟子就学人哭丧；第二次住在市场旁边，孟子就学人叫卖；第三次搬到学校旁边，孟子终于开始学礼仪读书了。",
    moral: "好邻居胜过好房子",
    animation: "mother-move",
    bgColor: "#FFD6E8",
    accentColor: "#E91E63"
  },
  {
    verse: "子不学，断机杼",
    pinyin: "zǐ bù xué, duàn jī zhù",
    story: "有一天孟子不想读书，跑回家玩。他的妈妈正在织布，看到儿子不用功，就把织布机上的线剪断了，对他说：你读书半途而废，就像我剪断的布一样，前功尽弃！孟子听了很惭愧，从此努力学习，后来成了大学问家。",
    moral: "半途而废最可惜",
    animation: "loom-cut",
    bgColor: "#E8F5E9",
    accentColor: "#43A047"
  },
  {
    verse: "窦燕山，有义方",
    pinyin: "dòu yān shān, yǒu yì fāng",
    story: "古时候有个叫窦禹钧的人，住在燕山一带，所以大家叫他窦燕山。他开始时对孩子很溺爱，孩子们都不成器。后来他反省自己，改变了教育方法，用正确的道理和家规来教导孩子们。",
    moral: "教育要有好方法",
    animation: "teacher-parent",
    bgColor: "#FFF8E1",
    accentColor: "#FF8F00"
  },
  {
    verse: "教五子，名俱扬",
    pinyin: "jiào wǔ zǐ, míng jù yáng",
    story: "窦燕山教导五个儿子，每个儿子都很优秀，个个金榜题名，名扬四方。他的大儿子考中状元，二儿子考中进士，其他几个儿子也都很有成就。五子登科的故事从此传为佳话，告诉我们好的教育能培养出优秀的孩子。",
    moral: "五子登科传美名",
    animation: "five-children",
    bgColor: "#E3F2FD",
    accentColor: "#1976D2"
  },
  // ========== 第二部分：学习的重要性 ==========
  {
    verse: "养不教，父之过",
    pinyin: "yǎng bù jiào, fù zhī guò",
    story: "只生养孩子而不教育，这是父亲的过错。父母不仅要给孩子吃饭穿衣，更重要的是教他做人的道理。父母是孩子的第一任老师，家庭是孩子的第一所学校。",
    moral: "养育更要教育",
    animation: "father-teach",
    bgColor: "#FFECB3",
    accentColor: "#EF6C00"
  },
  {
    verse: "教不严，师之惰",
    pinyin: "jiào bù yán, shī zhī duò",
    story: "如果老师对学生要求不严格，没有认真教学生，那就是老师的懒惰和失职。严师出高徒，严格的教育才能培养出真正的人才。但严格不等于严厉，要严中有爱。",
    moral: "老师要严格认真",
    animation: "teacher-strict",
    bgColor: "#D1C4E9",
    accentColor: "#512DA8"
  },
  {
    verse: "子不学，非所宜",
    pinyin: "zǐ bù xué, fēi suǒ yí",
    story: "小孩子如果不肯好好学习，是非常不应该的。学习是孩子的本分，就像蜜蜂要采蜜、小鸟要学飞一样。不学习就不懂道理，不懂道理就会做错事。",
    moral: "学习是孩子的本分",
    animation: "child-study",
    bgColor: "#B2EBF2",
    accentColor: "#00838F"
  },
  {
    verse: "幼不学，老何为",
    pinyin: "yòu bù xué, lǎo hé wéi",
    story: "年轻时不努力学习，到老了能有什么作为呢？少壮不努力，老大徒伤悲。学习要趁年轻，小时候记忆力好，学东西快，长大了要用时才不后悔。",
    moral: "少壮不努力，老大徒伤悲",
    animation: "young-old",
    bgColor: "#FFCDD2",
    accentColor: "#C62828"
  },
  {
    verse: "玉不琢，不成器",
    pinyin: "yù bù zhuó, bù chéng qì",
    story: "一块珍贵的玉石，如果不经过雕琢，是不会成为精美的器物的。玉石本来很美，但要经过工匠的打磨、雕刻才能变成漂亮的玉佩、花瓶。人也是一样，即使很聪明，也要学习才能成才。",
    moral: "人才需要雕琢培养",
    animation: "jade-carve",
    bgColor: "#C8E6C9",
    accentColor: "#2E7D32"
  },
  {
    verse: "人不学，不知义",
    pinyin: "rén bù xué, bù zhī yì",
    story: "人如果不学习，就不懂得道理，不知道什么是对的，什么是错的。通过读书学习，我们才能明白孝顺、友爱、诚信、礼貌这些人生道理，成为一个有品德的人。",
    moral: "学习让人懂得道理",
    animation: "book-wisdom",
    bgColor: "#BBDEFB",
    accentColor: "#1565C0"
  },
  // ========== 第三部分：为人处事、孝敬长辈 ==========
  {
    verse: "为人子，方少时",
    pinyin: "wéi rén zǐ, fāng shào shí",
    story: "做子女的，在年少的时候就要开始学习如何做人。父母和老师要从小教孩子礼貌、孝顺、友善。小时候养成的好习惯，长大了就不会改变。",
    moral: "年少时就要学做人",
    animation: "child-grow",
    bgColor: "#F8BBD0",
    accentColor: "#AD1457"
  },
  {
    verse: "亲师友，习礼仪",
    pinyin: "qīn shī yǒu, xí lǐ yí",
    story: "要亲近良师益友，学习各种礼仪规矩。见到老师要问好，见到长辈要敬礼，和朋友要友善相处。中国被称为礼仪之邦，就是因为我们讲究礼貌待人。",
    moral: "亲近良师，学习礼仪",
    animation: "teacher-friend",
    bgColor: "#B3E5FC",
    accentColor: "#0277BD"
  },
  {
    verse: "香九龄，能温席",
    pinyin: "xiāng jiǔ líng, néng wēn xí",
    story: "东汉时有个叫黄香的孩子，九岁的时候就非常孝顺。夏天天气热，他用扇子把父母的床铺扇凉；冬天天气冷，他先钻进被窝把席子焐暖，再请父母去睡。皇帝听说后称赞他为天下无双的江夏黄童。",
    moral: "九岁黄香孝父母",
    animation: "huangxiang-warm",
    bgColor: "#FFE0B2",
    accentColor: "#E65100"
  },
  {
    verse: "孝于亲，所当执",
    pinyin: "xiào yú qīn, suǒ dāng zhí",
    story: "孝顺父母是每个人都应该做到的事情，是天经地义的。父母辛辛苦苦把我们养大，我们要从小事做起：听父母的话、主动帮忙做家务、好好学习不让父母操心，这些都是孝顺。",
    moral: "孝顺父母是天经地义",
    animation: "filial-piety",
    bgColor: "#DCEDC8",
    accentColor: "#558B2F"
  },
  {
    verse: "融四岁，能让梨",
    pinyin: "róng sì suì, néng ràng lí",
    story: "东汉末年有个叫孔融的小朋友，四岁时家里来了客人。父亲端出一盘梨让孩子们分，孔融主动挑了最小的，把大梨留给哥哥和弟弟。父亲问他为什么，他说：哥哥比我大，应该吃大的；弟弟比我小，我应该让着他。",
    moral: "四岁孔融让大梨",
    animation: "kongrong-pear",
    bgColor: "#FFF9C4",
    accentColor: "#F57F17"
  },
  {
    verse: "弟于长，宜先知",
    pinyin: "dì yú zhǎng, yí xiān zhī",
    story: "弟弟要尊重哥哥，弟妹要尊敬兄姐，这些道理应该从小就知道。兄弟姐妹之间要和睦相处，有好东西要一起分享，不要争抢打架。家庭和睦才是最大的幸福。",
    moral: "兄弟姐妹要友爱",
    animation: "siblings-love",
    bgColor: "#D7CCC8",
    accentColor: "#5D4037"
  },
  // ========== 第四部分：基础知识（数字、天文、地理） ==========
  {
    verse: "首孝弟，次见闻",
    pinyin: "shǒu xiào tì, cì jiàn wén",
    story: "人生最重要的首先是孝顺父母、友爱兄弟，其次才是多读书多见识。先学会做人的根本道理，再去学习知识文化。没有品德，学问再多也没用。",
    moral: "先学做人，再学知识",
    animation: "priority-first",
    bgColor: "#F0F4C3",
    accentColor: "#9E9D24"
  },
  {
    verse: "知某数，识某文",
    pinyin: "zhī mǒu shǔ, shí mǒu wén",
    story: "在学习做人道理之后，就要学习数学和文化知识。数数、认字、读书、写字，这些都是基础知识。数学让人聪明，读书让人明理，两者缺一不可。",
    moral: "算数识字打基础",
    animation: "count-read",
    bgColor: "#E1BEE7",
    accentColor: "#6A1B9A"
  },
  {
    verse: "一而十，十而百",
    pinyin: "yī ér shí, shí ér bǎi",
    story: "数字从一到十是基础，十个十是一百。数学学习要循序渐进，从简单到复杂。小朋友学数数：12345... 然后学加减法，然后学乘除法，一步一步来。",
    moral: "数字从一到百",
    animation: "numbers-count",
    bgColor: "#B2DFDB",
    accentColor: "#00695C"
  },
  {
    verse: "百而千，千而万",
    pinyin: "bǎi ér qiān, qiān ér wàn",
    story: "一百个一百是一万，数字可以无限大。学习也一样，积累知识从少到多，从简单到复杂。每天学一点，日积月累就会变成大学问家！",
    moral: "数字无穷，学无止境",
    animation: "numbers-infinity",
    bgColor: "#FFCCBC",
    accentColor: "#BF360C"
  },
  {
    verse: "三才者，天地人",
    pinyin: "sān cái zhě, tiān dì rén",
    story: "古人说的三才，指的是天、地、人三个方面。天上有日月星辰，地上有山川河流草木，人是万物之灵。人生活在天地之间，要了解天地的道理，与自然和谐相处。",
    moral: "天地人合称三才",
    animation: "heaven-earth-man",
    bgColor: "#C5CAE9",
    accentColor: "#283593"
  },
  {
    verse: "三光者，日月星",
    pinyin: "sān guāng zhě, rì yuè xīng",
    story: "天上有三种光源：太阳、月亮和星星。白天太阳给我们光和热，晚上月亮和星星照亮夜空。没有太阳就没有生命，没有月亮就没有潮汐。天上的万物都在默默为人类服务。",
    moral: "日月星是天空三光",
    animation: "sun-moon-star",
    bgColor: "#BBDEFB",
    accentColor: "#0D47A1"
  },
  {
    verse: "三纲者，君臣义",
    pinyin: "sān gāng zhě, jūn chén yì",
    story: "古人讲的三纲是指三种重要关系：君臣之间要有道义。君主爱护臣子，臣子忠于君主。放在今天来说，就是领导和员工之间要相互尊重，工作才能做好。",
    moral: "君臣之间要有道义",
    animation: "ruler-subject",
    bgColor: "#FFECB3",
    accentColor: "#FF6F00"
  },
  {
    verse: "父子亲，夫妇顺",
    pinyin: "fù zǐ qīn, fū fù shùn",
    story: "父子之间要亲爱，父母爱护子女，子女孝顺父母；夫妻之间要和睦相处，互相体谅。家庭是社会的基础，家和万事兴，家庭和睦了，整个社会才会安定。",
    moral: "家庭和睦最重要",
    animation: "family-harmony",
    bgColor: "#F8BBD0",
    accentColor: "#D81B60"
  },
  {
    verse: "曰春夏，曰秋冬",
    pinyin: "yuē chūn xià, yuē qiū dōng",
    story: "一年分为春夏秋冬四个季节。春天万物复苏，花儿盛开；夏天阳光明媚，庄稼茂盛；秋天硕果累累，是收获的季节；冬天白雪皑皑，万物休息。四季循环，生生不息。",
    moral: "春夏秋冬四季循环",
    animation: "four-seasons",
    bgColor: "#C8E6C9",
    accentColor: "#388E3C"
  },
  {
    verse: "此四时，运不穷",
    pinyin: "cǐ sì shí, yùn bù qióng",
    story: "这四个季节循环往复，永远不会停止。就像钟表的指针一样，春去夏来，秋去冬来。人生也是这样，少年、青年、中年、老年，每个阶段都有该做的事。",
    moral: "四季运转永不停",
    animation: "season-cycle",
    bgColor: "#B3E5FC",
    accentColor: "#0288D1"
  },
  {
    verse: "曰南北，曰西东",
    pinyin: "yuē nán běi, yuē xī dōng",
    story: "方向有四个：南、北、西、东。太阳升起的地方是东方，太阳落下的地方是西方。看指南针可以找到南方，北极星指引北方。分清方向就不会迷路啦！",
    moral: "东南西北四方",
    animation: "four-directions",
    bgColor: "#E1BEE7",
    accentColor: "#7B1FA2"
  },
  {
    verse: "此四方，应乎中",
    pinyin: "cǐ sì fāng, yìng hū zhōng",
    story: "这四个方向都以中央为基准。没有中央就分不清东南西北。做人也要居中守正，不偏不倚，做任何事都要公平公正，不偏袒哪一方。",
    moral: "中央是四方的标准",
    animation: "center-direction",
    bgColor: "#FFF9C4",
    accentColor: "#F9A825"
  },
  {
    verse: "曰水火，木金土",
    pinyin: "yuē shuǐ huǒ, mù jīn tǔ",
    story: "古人认为世界万物由五种基本元素组成：水、火、木、金、土，叫五行。水能灭火，火能烧木，木能破土，土能埋金，金能盛水，五行相生相克，很有意思。",
    moral: "金木水火土是五行",
    animation: "five-elements",
    bgColor: "#D7CCC8",
    accentColor: "#4E342E"
  },
  {
    verse: "此五行，本乎数",
    pinyin: "cǐ wǔ xíng, běn hū shù",
    story: "这五行的相生相克，都是根据一定的数理规律来的。古人用五行来解释很多自然现象，比如五脏、五色、五味都和五行对应。学习要讲究规律，不能凭感觉乱来。",
    moral: "五行生克有规律",
    animation: "elements-order",
    bgColor: "#F0F4C3",
    accentColor: "#827717"
  },
  // ========== 第五部分：人伦五常、日常生活 ==========
  {
    verse: "曰仁义，礼智信",
    pinyin: "yuē rén yì, lǐ zhì xìn",
    story: "做人要有五种基本品德：仁（爱心）、义（正直）、礼（礼貌）、智（智慧）、信（诚实）。这五种品德是古人说的五常，是做人的根本。有了这五种品德，才能成为受大家欢迎的人。",
    moral: "仁义礼智信是五常",
    animation: "five-virtues",
    bgColor: "#FFE0B2",
    accentColor: "#E65100"
  },
  {
    verse: "此五常，不容紊",
    pinyin: "cǐ wǔ cháng, bù róng wěn",
    story: "这五种品德是永远不能混乱的，无论什么时代都要遵守。有爱心就会帮助别人，正直就不会做坏事，有礼貌就会尊重别人，有智慧就能明辨是非，诚实就能让人信任。",
    moral: "五常不可混乱",
    animation: "virtues-stable",
    bgColor: "#DCEDC8",
    accentColor: "#558B2F"
  },
  {
    verse: "稻粱菽，麦黍稷",
    pinyin: "dào liáng shū, mài shǔ jì",
    story: "我们吃的粮食有六种：稻子（大米）、高粱、豆子、麦子（面粉）、小米和黄米。这些都是农民伯伯辛苦种出来的，所以吃饭时不能浪费粮食，粒粒皆辛苦！",
    moral: "六种粮食养育人",
    animation: "six-grains",
    bgColor: "#FFF8E1",
    accentColor: "#FF8F00"
  },
  {
    verse: "此六谷，人所食",
    pinyin: "cǐ liù gǔ, rén suǒ shí",
    story: "这六种谷物是人类的主食。中国人吃米饭和面条已有几千年历史了。每种粮食都有自己的营养价值，不能挑食哦！大米补气，面粉养人，豆子补钙，样样都要吃。",
    moral: "不挑食才健康",
    animation: "food-variety",
    bgColor: "#E1BEE7",
    accentColor: "#6A1B9A"
  },
  {
    verse: "马牛羊，鸡犬豕",
    pinyin: "mǎ niú yáng, jī quǎn shǐ",
    story: "人类饲养的六种家畜是：马、牛、羊、鸡、狗、猪。马可以拉车和骑乘，牛可以耕田，羊提供羊毛，鸡下蛋报晓，狗看家护院，猪提供肉食。它们都是人类的好朋友。",
    moral: "六畜为人类服务",
    animation: "six-animals",
    bgColor: "#CFD8DC",
    accentColor: "#455A64"
  },
  {
    verse: "此六畜，人所饲",
    pinyin: "cǐ liù chù, rén suǒ sì",
    story: "这六种家畜都是人类饲养、为人类服务的。我们要善待动物，它们也是生命。现在很多家庭养猫狗当宠物，就要好好照顾它们，不能虐待动物。",
    moral: "饲养动物要善待",
    animation: "animal-care",
    bgColor: "#FFCDD2",
    accentColor: "#C62828"
  },
  {
    verse: "曰喜怒，曰哀惧",
    pinyin: "yue xi nu, yue ai ju",
    story: "人有喜悦、愤怒、悲哀和害怕等情绪。古人把这些感受写进《三字经》，是提醒孩子先认识自己的心情，遇事不要被情绪牵着走。",
    moral: "认识喜怒哀惧",
    animation: "seven-emotions",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "爱恶欲，七情具",
    pinyin: "ai wu yu, qi qing ju",
    story: "喜欢、厌恶和想要也是人的常见情绪。七情人人都有，关键是学会表达和控制，比如生气时先停一停，说清楚原因。",
    moral: "七情人人都有",
    animation: "seven-emotions",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "匏土革，木石金",
    pinyin: "pao tu ge, mu shi jin",
    story: "古代乐器可以用葫芦、陶土、皮革、木头、石头和金属制成。不同材料发出的声音不同，合在一起就有了丰富的音乐。",
    moral: "材料不同，声音不同",
    animation: "eight-sounds",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "丝与竹，乃八音",
    pinyin: "si yu zhu, nai ba yin",
    story: "丝弦和竹管也能制成乐器。加上前面的六类材料，合称八音。音乐让礼仪更庄重，也让生活更温和美好。",
    moral: "八音组成古代音乐",
    animation: "eight-sounds",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "高曾祖，父而身",
    pinyin: "gao zeng zu, fu er shen",
    story: "从高祖、曾祖、祖父到父亲，再到自己，这是一条家族传承的线。每个人都不是孤零零来的，身后有长辈的养育和期望。",
    moral: "记住家族传承",
    animation: "family-line",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "身而子，子而孙",
    pinyin: "shen er zi, zi er sun",
    story: "从自己往后，是子女和孙辈。家风会一代一代传下去，所以今天养成诚实、勤学、孝顺的习惯，也会影响将来的家庭。",
    moral: "好家风代代传",
    animation: "family-line",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "自子孙，至玄曾",
    pinyin: "zi zi sun, zhi xuan zeng",
    story: "从子孙再往后，还会有曾孙、玄孙。古人用这些称呼帮助孩子认识亲族关系，也提醒大家珍惜亲人之间的联系。",
    moral: "认识后代称谓",
    animation: "family-line",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "乃九族，人之伦",
    pinyin: "nai jiu zu, ren zhi lun",
    story: "上自高祖，下至玄孙，合起来就是九族。懂得亲族伦常，才知道尊敬长辈、爱护晚辈、和睦相处。",
    moral: "九族体现人伦",
    animation: "family-line",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "父子恩，夫妇从",
    pinyin: "fu zi en, fu fu cong",
    story: "父母和子女之间重在恩爱，夫妻之间重在互相扶持。家庭里的每个人都尽自己的责任，家里才会安稳温暖。",
    moral: "家庭关系要有恩和顺",
    animation: "ten-duties",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "兄则友，弟则恭",
    pinyin: "xiong ze you, di ze gong",
    story: "哥哥姐姐要友爱弟妹，弟弟妹妹要尊敬兄姐。兄弟姐妹不是用来争抢的，而是一起成长、彼此帮助的亲人。",
    moral: "兄友弟恭",
    animation: "ten-duties",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "长幼序，友与朋",
    pinyin: "zhang you xu, you yu peng",
    story: "长辈和晚辈相处要有次序，朋友之间要讲信义。排队、让座、守约，都是把这些道理用在生活里。",
    moral: "长幼有序，朋友守信",
    animation: "ten-duties",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "君则敬，臣则忠",
    pinyin: "jun ze jing, chen ze zhong",
    story: "古代讲君臣关系，君主要尊重臣子，臣子要尽忠职守。放到今天，就是负责人要公平待人，做事的人要认真负责。",
    moral: "彼此尊重，各尽职责",
    animation: "ten-duties",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "此十义，人所同",
    pinyin: "ci shi yi, ren suo tong",
    story: "父子、夫妇、兄弟、长幼、朋友和君臣这些关系中，都有应守的义理。做人先明白责任，社会才会有秩序。",
    moral: "十义是共同准则",
    animation: "ten-duties",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "凡训蒙，须讲究",
    pinyin: "fan xun meng, xu jiang jiu",
    story: "教育刚开始学习的孩子，不能随便糊弄。老师和父母要认真选择内容、方法和次序，让孩子一步一步打好根基。",
    moral: "启蒙教育要认真",
    animation: "early-learning",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "详训诂，明句读",
    pinyin: "xiang xun gu, ming ju dou",
    story: "读古书要懂字词意思，也要知道哪里停顿。标点和解释看似小事，却能决定一句话是否读对、理解对。",
    moral: "读书要懂字义和停顿",
    animation: "early-learning",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "为学者，必有初",
    pinyin: "wei xue zhe, bi you chu",
    story: "做学问一定有起点。先认字、读句、懂礼，再慢慢读经典，就像盖房子要先打地基一样。",
    moral: "学习要从基础开始",
    animation: "early-learning",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "小学终，至四书",
    pinyin: "xiao xue zhong, zhi si shu",
    story: "启蒙基础学完后，就可以继续学习《论语》《孟子》《中庸》《大学》四书。学习要循序渐进，不能急着跳级。",
    moral: "基础之后读四书",
    animation: "early-learning",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  // ========== 第六部分：典籍经典 ==========
  {
    verse: "论语者，二十篇",
    pinyin: "lún yǔ zhě, èr shí piān",
    story: "《论语》这本书共有二十篇。它记录了孔子和他的学生们的对话，是儒家最重要的经典之一。学而时习之，不亦说乎？三人行，必有我师焉。这些名句都出自《论语》。",
    moral: "论语是儒家经典",
    animation: "lunyu-book",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "群弟子，记善言",
    pinyin: "qún dì zǐ, jì shàn yán",
    story: "《论语》是孔子的学生们记录老师的好言好语汇编成的书。孔子去世后，他的弟子们回忆老师平时的教诲，把那些有智慧的话记录下来，就成了这本流传两千多年的经典。",
    moral: "弟子记录老师教诲",
    animation: "disciples-record",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "孟子者，七篇止",
    pinyin: "mèng zǐ zhě, qī piān zhǐ",
    story: "《孟子》这本书共有七篇。孟子是孔子之后的大儒，被称为亚圣。他周游列国，劝说各国君主要以仁政爱护百姓。富贵不能淫，贫贱不能移，威武不能屈，这就是孟子说的大丈夫！",
    moral: "孟子七篇讲仁政",
    animation: "mencius-book",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "讲道德，说仁义",
    pinyin: "jiǎng dào dé, shuō rén yì",
    story: "孟子这本书主要讲道德和仁义的道理。他认为人性本善，每个人都有同情心、正义感、恭敬心、是非心。只要好好培养这些善心，每个人都能成为有品德的人。",
    moral: "孟子宣扬仁义道德",
    animation: "moral-teach",
    bgColor: "#F3E5F5",
    accentColor: "#6A1B9A"
  },
  {
    verse: "作中庸，子思笔",
    pinyin: "zuò zhōng yōng, zǐ sī bǐ",
    story: "《中庸》这本书是子思写的。子思是孔子的孙子，他继承了孔子的思想。中庸的意思是做事不偏不倚，不过分也不欠缺，恰到好处。比如：吃饭不要太饱也不要太饿，刚刚好才健康。",
    moral: "子思著作中庸",
    animation: "zhongyong-book",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "中不偏，庸不易",
    pinyin: "zhōng bù piān, yōng bú yì",
    story: "中就是不偏不倚，不偏向任何一方；庸就是不改变，坚守正道。做人做事要公平公正，坚持原则不随波逐流。比如答应别人的事要做到，不能因为有困难就反悔。",
    moral: "中庸之道不偏不倚",
    animation: "balance-neutral",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "作大学，乃曾子",
    pinyin: "zuò dà xué, nǎi zēng zǐ",
    story: "《大学》这本书是曾子写的。曾子是孔子的学生，以孝顺闻名。每天晚上他都要反省自己三件事：为人做事有没有尽心？和朋友交往有没有不守信？老师教的有没有认真学？",
    moral: "曾子著作大学",
    animation: "daxue-book",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "自修齐，至平治",
    pinyin: "zì xiū qí, zhì píng zhì",
    story: "《大学》讲的是修身、齐家、治国、平天下的道理。先修养好自己的品德，才能管理好家庭；家庭管理好了，才能治理好国家；国家治理好了，天下才能太平。一切要从自己做起。",
    moral: "修身齐家治国平天下",
    animation: "self-govern",
    bgColor: "#E8D5F8",
    accentColor: "#6A1B9A"
  },
  {
    verse: "孝经通，四书熟",
    pinyin: "xiao jing tong, si shu shu",
    story: "《孝经》讲孝道，四书讲做人和治学。把这些内容读通读熟，孩子就能懂得尊亲、修身和处世的根本道理。",
    moral: "通孝经，熟四书",
    animation: "classic-study",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "如六经，始可读",
    pinyin: "ru liu jing, shi ke du",
    story: "基础经典熟悉之后，才适合继续读更深的六经。学习像登山，一层一层往上走，才不会迷路。",
    moral: "先打基础再读六经",
    animation: "classic-study",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "诗书易，礼春秋",
    pinyin: "shi shu yi, li chun qiu",
    story: "六经包括《诗》《书》《易》《礼》《乐》《春秋》。后来《乐经》失传，常以诗、书、易、礼、春秋为核心来学习。",
    moral: "认识儒家经典",
    animation: "six-classics",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "号六经，当讲求",
    pinyin: "hao liu jing, dang jiang qiu",
    story: "这些经典记录了古人的政治、礼仪、历史和思想。读它们不能只背字句，还要认真讲解和思考。",
    moral: "读经要讲求义理",
    animation: "six-classics",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "有连山，有归藏",
    pinyin: "you lian shan, you gui cang",
    story: "《连山》和《归藏》是古人传说中的两部易书，后来大多失传。它们说明古人很早就尝试用规律理解天地变化。",
    moral: "古代有多种易书",
    animation: "three-yi",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "有周易，三易详",
    pinyin: "you zhou yi, san yi xiang",
    story: "加上流传至今的《周易》，合称三易。《周易》讲变化和规律，提醒人做事要观察时势、谨慎选择。",
    moral: "三易以周易传世",
    animation: "three-yi",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "有典谟，有训诰",
    pinyin: "you dian mo, you xun gao",
    story: "《尚书》中有典、谟、训、诰等文体，记录古代君臣治国的言论。它们像历史档案，帮助后人了解古代政治。",
    moral: "尚书保存古代政事",
    animation: "book-documents",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "有誓命，书之奥",
    pinyin: "you shi ming, shu zhi ao",
    story: "誓和命也是《尚书》里的重要文体，常见于出征、任命和告诫。读懂这些，才能看到《尚书》深奥的一面。",
    moral: "尚书文体内容深奥",
    animation: "book-documents",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "我周公，作周礼",
    pinyin: "wo zhou gong, zuo zhou li",
    story: "周公辅佐成王，制定礼乐制度。《周礼》记录了周代官制和礼制，体现古人治理国家重视秩序。",
    moral: "周公制礼作乐",
    animation: "zhou-rites",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "著六官，存治体",
    pinyin: "zhu liu guan, cun zhi ti",
    story: "《周礼》按天、地、春、夏、秋、冬六官来安排职责。分工清楚，国家机器才能有条不紊地运转。",
    moral: "六官体现治理体系",
    animation: "zhou-rites",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "大小戴，注礼记",
    pinyin: "da xiao dai, zhu li ji",
    story: "汉代大戴、小戴整理和注解礼学文献，形成《礼记》等内容。许多关于礼仪、学习和修身的名篇都保存在其中。",
    moral: "大小戴整理礼学",
    animation: "book-rites",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "述圣言，礼乐备",
    pinyin: "shu sheng yan, li yue bei",
    story: "《礼记》记述圣贤关于礼乐的言论。礼让人有规矩，乐让人心平和，礼乐相配才能教化人心。",
    moral: "礼乐共同教化人",
    animation: "book-rites",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "曰国风，曰雅颂",
    pinyin: "yue guo feng, yue ya song",
    story: "《诗经》分为国风、雅、颂。国风多来自民间歌谣，雅和颂多用于朝廷和祭祀，能看到古人的生活和情感。",
    moral: "诗经分风雅颂",
    animation: "book-poetry",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "号四诗，当讽咏",
    pinyin: "hao si shi, dang feng yong",
    story: "《诗经》的内容适合反复诵读。读诗不是只看字面，还要体会声音、节奏和情感。",
    moral: "读诗要反复吟诵",
    animation: "book-poetry",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "诗既亡，春秋作",
    pinyin: "shi ji wang, chun qiu zuo",
    story: "周代采诗制度衰落后，孔子整理《春秋》。这部书用简洁文字记录鲁国历史，也寄托了是非判断。",
    moral: "春秋记录历史褒贬",
    animation: "spring-autumn",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "寓褒贬，别善恶",
    pinyin: "yu bao bian, bie shan e",
    story: "《春秋》写事很简短，却暗含赞许和批评。读历史要分清善恶，知道什么值得学习，什么应该警惕。",
    moral: "历史能辨善恶",
    animation: "spring-autumn",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "三传者，有公羊",
    pinyin: "san zhuan zhe, you gong yang",
    story: "解释《春秋》的书有三传，其中一部是《公羊传》。它帮助后人理解《春秋》简短文字背后的意思。",
    moral: "公羊传解释春秋",
    animation: "three-commentaries",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "有左氏，有谷梁",
    pinyin: "you zuo shi, you gu liang",
    story: "另外两部是《左传》和《谷梁传》。《左传》故事详细，《谷梁传》重在义理，三传合看更完整。",
    moral: "三传合解春秋",
    animation: "three-commentaries",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "经既明，方读子",
    pinyin: "jing ji ming, fang du zi",
    story: "经书的根本道理明白后，再去读诸子百家的书。先有主干，再看分支，知识就不会散乱。",
    moral: "先明经，再读子",
    animation: "classic-order",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "撮其要，记其事",
    pinyin: "cuo qi yao, ji qi shi",
    story: "读诸子书要抓住要点，也要记住重要事例。只背很多名字没有用，能说出道理和故事才算真正理解。",
    moral: "读书要抓要点",
    animation: "classic-order",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "五子者，有荀扬",
    pinyin: "wu zi zhe, you xun yang",
    story: "五子中有荀子和扬雄。荀子重视礼法和学习，扬雄擅长文章与思想，他们都是后人研读的学者。",
    moral: "认识荀子和扬雄",
    animation: "five-masters",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "文中子，及老庄",
    pinyin: "wen zhong zi, ji lao zhuang",
    story: "文中子、老子、庄子也列在五子之中。老庄讲自然和逍遥，能让人从另一面思考人生。",
    moral: "诸子思想各有重点",
    animation: "five-masters",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "经子通，读诸史",
    pinyin: "jing zi tong, du zhu shi",
    story: "经书和诸子读通之后，就可以读历代史书。历史记录兴衰成败，能帮助人看清事情的来龙去脉。",
    moral: "通经子后读史",
    animation: "history-study",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "考世系，知终始",
    pinyin: "kao shi xi, zhi zhong shi",
    story: "读历史要考察朝代世系，知道每件事如何开始、如何结束。这样才不会只记零散故事，而能看见历史脉络。",
    moral: "读史要明始终",
    animation: "history-study",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "自羲农，至黄帝",
    pinyin: "zi xi nong, zhi huang di",
    story: "从伏羲、神农到黄帝，是传说中的上古时代。古人用这些人物讲述文明起源，如结网、农耕、医药和制度。",
    moral: "三皇开文明之始",
    animation: "ancient-rulers",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "号三皇，居上世",
    pinyin: "hao san huang, ju shang shi",
    story: "伏羲、神农、黄帝常被称为三皇，位于很早的上古时期。它们承载的是古人对文明起点的记忆。",
    moral: "三皇居上古",
    animation: "ancient-rulers",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "唐有虞，号二帝",
    pinyin: "tang you yu, hao er di",
    story: "唐尧和虞舜合称二帝。传说他们以德治天下，重视贤能，不把天下当作私产。",
    moral: "尧舜合称二帝",
    animation: "ancient-rulers",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "相揖逊，称盛世",
    pinyin: "xiang yi xun, cheng sheng shi",
    story: "尧把帝位禅让给舜，舜又选贤任能。古人把这种谦让和贤德治理称为盛世，提醒后人重德不重私利。",
    moral: "禅让体现贤德",
    animation: "ancient-rulers",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  // ========== 第七部分：历史朝代 ==========
  {
    verse: "夏有禹，商有汤",
    pinyin: "xià yǒu yǔ, shāng yǒu tāng",
    story: "夏朝的开国君主是大禹，商朝的开国君主是商汤。大禹为了治水，三过家门而不入，终于治好了洪水；商汤爱护百姓，是有名的贤君。他们都是中国历史上的好皇帝。",
    moral: "夏禹商汤是开国贤君",
    animation: "ancient-kings",
    bgColor: "#D7CCC8",
    accentColor: "#4E342E"
  },
  {
    verse: "周文武，称三王",
    pinyin: "zhōu wén wǔ, chēng sān wáng",
    story: "周文王奠定周朝基础，周武王灭商建立周朝。大禹、商汤、周文王和周武王代表古代贤明君主，其中周文王、周武王合称文武。他们都有一个共同点：爱护百姓、任用贤人、以德治国，所以得到了天下人的拥护。",
    moral: "三王都是贤明君主",
    animation: "three-kings",
    bgColor: "#CFD8DC",
    accentColor: "#37474F"
  },
  {
    verse: "夏传子，家天下",
    pinyin: "xia chuan zi, jia tian xia",
    story: "大禹之后，启继承了王位，夏朝从禅让变成世袭。天下像家族产业一样传给子孙，这就是家天下的开始。",
    moral: "夏朝开始家天下",
    animation: "xia-dynasty",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "四百载，迁夏社",
    pinyin: "si bai zai, qian xia she",
    story: "夏朝大约延续四百年，后来国运衰败，被商汤取代。历史告诉我们，国家要长久，不能只靠血统，更要靠德政。",
    moral: "夏朝四百年后衰亡",
    animation: "xia-dynasty",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "汤伐夏，国号商",
    pinyin: "tāng fá xià, guó hào shāng",
    story: "夏朝最后一个皇帝叫桀，非常残暴，百姓苦不堪言。商汤起兵讨伐夏桀，建立了商朝。商朝有著名的青铜器和甲骨文，是中国文明的重要发展阶段。",
    moral: "商汤灭夏建商朝",
    animation: "shang-dynasty",
    bgColor: "#FFE0B2",
    accentColor: "#EF6C00"
  },
  {
    verse: "六百载，至纣亡",
    pinyin: "liù bǎi zǎi, zhì zhòu wáng",
    story: "商朝延续了六百年，最后一个皇帝叫纣王。纣王和夏桀一样残暴，建酒池肉林，宠爱妲己，害死了很多忠臣。商朝最终被周武王所灭，纣王自焚而死。",
    moral: "商朝六百载亡于纣王",
    animation: "zhou-fall",
    bgColor: "#B0BEC5",
    accentColor: "#37474F"
  },
  {
    verse: "周武王，始诛纣",
    pinyin: "zhōu wǔ wáng, shǐ zhū zhòu",
    story: "周武王起兵讨伐商纣王，在牧野之战中取得胜利。武王有姜子牙、周公旦等贤臣辅佐，战后分封诸侯，建立了周朝。周朝是中国历史上最长的朝代。",
    moral: "周武王灭商建周",
    animation: "zhou-king",
    bgColor: "#C5E1A5",
    accentColor: "#33691E"
  },
  {
    verse: "八百载，最长久",
    pinyin: "bā bǎi zǎi, zuì cháng jiǔ",
    story: "周朝延续了八百年，是中国历史上最长的朝代。周朝分西周和东周，东周又分春秋战国。这八百年里出了孔子、孟子、老子等许多圣贤，是中华文化的黄金时代。",
    moral: "周朝八百年最长久",
    animation: "zhou-long",
    bgColor: "#D1C4E9",
    accentColor: "#4527A0"
  },
  {
    verse: "周辙东，王纲坠",
    pinyin: "zhou zhe dong, wang gang zhui",
    story: "周平王东迁以后，周王室权威下降，诸侯不再像从前那样听命。周朝进入东周，天下秩序开始松动。",
    moral: "东周王纲坠落",
    animation: "east-zhou",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "逞干戈，尚游说",
    pinyin: "cheng gan ge, shang you shui",
    story: "诸侯之间常常打仗，谋士也四处游说君主。这个时代虽然纷乱，却也出现了许多思想家和治国主张。",
    moral: "乱世中百家游说",
    animation: "east-zhou",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "始春秋，终战国",
    pinyin: "shǐ chūn qiū, zhōng zhàn guó",
    story: "周朝后期分为春秋和战国两个时期。春秋时期有春秋五霸，战国时期有战国七雄。这是一个百家争鸣的时代，孔子、孟子、老子、庄子、墨子等思想家都出现在这个时期。",
    moral: "春秋战国百家争鸣",
    animation: "warring-states",
    bgColor: "#FFCCBC",
    accentColor: "#BF360C"
  },
  {
    verse: "五霸强，七雄出",
    pinyin: "wǔ bà qiáng, qī xióng chū",
    story: "春秋时期有齐桓公、晋文公、秦穆公、宋襄公、楚庄王五个霸主；战国时期有齐、楚、燕、韩、赵、魏、秦七个强国。这些国家之间互相征战，最后秦国统一了中国。",
    moral: "五霸七雄轮番登场",
    animation: "warring-seven",
    bgColor: "#B2EBF2",
    accentColor: "#00838F"
  },
  {
    verse: "嬴秦氏，始兼并",
    pinyin: "yíng qín shì, shǐ jiān bìng",
    story: "秦始皇嬴政统一了六国，建立了中国历史上第一个统一的大帝国。秦始皇统一了文字、货币、度量衡，还修建了万里长城。虽然秦朝只有十几年，但影响深远。",
    moral: "秦始皇统一六国",
    animation: "qin-unify",
    bgColor: "#90CAF9",
    accentColor: "#1565C0"
  },
  {
    verse: "传二世，楚汉争",
    pinyin: "chuán èr shì, chǔ hàn zhēng",
    story: "秦朝只传到秦二世就灭亡了。之后是楚汉相争，项羽和刘邦打了四年仗。项羽是楚国的贵族，力大无穷；刘邦是平民出身，会用人。最后刘邦打败了项羽，建立了汉朝。",
    moral: "秦亡后楚汉相争",
    animation: "chu-han",
    bgColor: "#FFCDD2",
    accentColor: "#C62828"
  },
  {
    verse: "高祖兴，汉业建",
    pinyin: "gāo zǔ xīng, hàn yè jiàn",
    story: "汉高祖刘邦兴起，打败了项羽，建立了汉朝。刘邦善于用人，手下有张良、萧何、韩信三杰。汉朝是中国历史上第一个长期稳定的大一统王朝，我们现在说的汉语、汉字都来自汉朝。",
    moral: "刘邦建立汉朝",
    animation: "han-found",
    bgColor: "#F8BBD0",
    accentColor: "#AD1457"
  },
  {
    verse: "至孝平，王莽篡",
    pinyin: "zhì xiào píng, wáng mǎng cuàn",
    story: "汉朝传到孝平皇帝时，被大臣王莽篡位了。王莽建立了新朝，但他的改革失败了，天下大乱。汉朝后来被刘秀复兴，分为西汉和东汉，共延续了四百年。",
    moral: "王莽篡汉建新朝",
    animation: "wangmang-usurp",
    bgColor: "#E1BEE7",
    accentColor: "#6A1B9A"
  },
  {
    verse: "光武兴，为东汉",
    pinyin: "guāng wǔ xīng, wéi dōng hàn",
    story: "光武帝刘秀起兵复兴汉朝，建立了东汉。刘秀是刘邦的后代，他文武双全，以柔道治天下，深得民心。东汉时期造纸术被发明出来，佛教也传入了中国。",
    moral: "刘秀中兴东汉",
    animation: "eastern-han",
    bgColor: "#FFF9C4",
    accentColor: "#F57F17"
  },
  {
    verse: "四百年，终于献",
    pinyin: "sì bǎi nián, zhōng yú xiàn",
    story: "西汉和东汉加起来共四百年，最后到汉献帝时灭亡。东汉末年黄巾起义，天下大乱，曹操、刘备、孙权三分天下，进入了三国时代。《三国演义》的故事就发生在这个时期。",
    moral: "汉朝四百年亡于献帝",
    animation: "han-end",
    bgColor: "#D7CCC8",
    accentColor: "#5D4037"
  },
  {
    verse: "魏蜀吴，争汉鼎",
    pinyin: "wèi shǔ wú, zhēng hàn dǐng",
    story: "三国时期，魏国、蜀国、吴国争夺天下。曹操建立魏国，刘备建立蜀国（有诸葛亮辅佐），孙权建立吴国。三国有许多著名故事：桃园三结义、草船借箭、火烧赤壁等等。",
    moral: "魏蜀吴三国鼎立",
    animation: "three-kingdoms",
    bgColor: "#CFD8DC",
    accentColor: "#455A64"
  },
  {
    verse: "号三国，迄两晋",
    pinyin: "hào sān guó, qì liǎng jìn",
    story: "这一时期号称三国，最终被晋朝统一。三国之后是西晋和东晋两晋时期。西晋统一了三国，但很快因为八王之乱而灭亡；东晋偏安江南，和北方的五胡十六国并立。",
    moral: "三国归晋",
    animation: "three-to-jin",
    bgColor: "#B2DFDB",
    accentColor: "#00695C"
  },
  {
    verse: "宋齐继，梁陈承",
    pinyin: "song qi ji, liang chen cheng",
    story: "两晋之后，南方先后有宋、齐、梁、陈四个朝代。它们延续时间不长，却在文学、书法和佛教文化上很活跃。",
    moral: "宋齐梁陈相继",
    animation: "southern-dynasties",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "为南朝，都金陵",
    pinyin: "wei nan chao, du jin ling",
    story: "宋齐梁陈都把都城设在金陵，也就是今天的南京一带，所以合称南朝。江南文化在这时不断发展。",
    moral: "南朝都城在金陵",
    animation: "southern-dynasties",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "北元魏，分东西",
    pinyin: "bei yuan wei, fen dong xi",
    story: "北方的北魏后来分裂成东魏和西魏。南北朝时期，南方和北方政权并立，民族交流也更加频繁。",
    moral: "北魏分为东西魏",
    animation: "northern-dynasties",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "宇文周，与高齐",
    pinyin: "yu wen zhou, yu gao qi",
    story: "西魏之后有宇文氏建立北周，东魏之后有高氏建立北齐。北周后来灭北齐，为隋朝统一打下基础。",
    moral: "北周北齐并立",
    animation: "northern-dynasties",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "迨至隋，一土宇",
    pinyin: "dai zhi sui, yi tu yu",
    story: "到了隋朝，南北长期分裂的局面终于结束，天下重新统一。统一后交通、制度和文化联系更紧密。",
    moral: "隋朝重新统一天下",
    animation: "sui-dynasty",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "不再传，失统绪",
    pinyin: "bu zai chuan, shi tong xu",
    story: "隋朝只传到第二代就灭亡了。隋炀帝劳民伤财，导致天下大乱，说明治理国家不能脱离百姓承受能力。",
    moral: "隋朝二世而亡",
    animation: "sui-dynasty",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "唐高祖，起义师",
    pinyin: "táng gāo zǔ, qǐ yì shī",
    story: "隋朝之后，唐高祖李渊起兵反隋，建立了唐朝。唐朝是中国历史上最繁荣的朝代之一。唐太宗李世民虚心纳谏，重用魏征等贤臣，开创了贞观之治。",
    moral: "李渊起兵建唐朝",
    animation: "tang-found",
    bgColor: "#FFECB3",
    accentColor: "#FF6F00"
  },
  {
    verse: "除隋乱，创国基",
    pinyin: "chú suí luàn, chuàng guó jī",
    story: "唐高祖平定了隋朝末年的乱世，开创了唐朝的基业。唐朝的首都长安是当时世界上最大、最繁华的城市。唐诗、书法、绘画、音乐都在唐朝达到了高峰。",
    moral: "唐朝国力强盛",
    animation: "tang-golden",
    bgColor: "#F8BBD0",
    accentColor: "#D81B60"
  },
  {
    verse: "二十传，三百载",
    pinyin: "èr shí chuán, sān bǎi zǎi",
    story: "唐朝传了二十位皇帝，延续了三百年。唐朝有著名的皇帝唐太宗、武则天（中国唯一的女皇帝）、唐玄宗等。李白、杜甫、白居易等大诗人都生活在唐朝。",
    moral: "唐朝传了三百年",
    animation: "tang-long",
    bgColor: "#E3F2FD",
    accentColor: "#1976D2"
  },
  {
    verse: "梁灭之，国乃改",
    pinyin: "liáng miè zhī, guó nǎi gǎi",
    story: "唐朝最终被后梁所灭，中国进入了五代十国的混乱时期。后梁、后唐、后晋、后汉、后周五个短命朝代轮番登场，每个都只持续十几年，是中国历史上战乱频繁的年代。",
    moral: "唐朝灭亡进入五代",
    animation: "tang-fall",
    bgColor: "#B0BEC5",
    accentColor: "#37474F"
  },
  {
    verse: "梁唐晋，及汉周",
    pinyin: "liang tang jin, ji han zhou",
    story: "唐亡以后，中原先后出现后梁、后唐、后晋、后汉、后周五个朝代。它们更替很快，社会仍不安定。",
    moral: "五代相继更替",
    animation: "five-dynasties",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "称五代，皆有由",
    pinyin: "cheng wu dai, jie you you",
    story: "这五个朝代合称五代。它们的兴亡都有原因，读历史要看清背后的民心、制度和用人得失。",
    moral: "五代兴亡皆有原因",
    animation: "five-dynasties",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "炎宋兴，受周禅",
    pinyin: "yán sòng xīng, shòu zhōu shàn",
    story: "宋太祖赵匡胤黄袍加身，建立了宋朝。他原本是后周的大将军，被部下拥立为皇帝。宋朝重文轻武，文化高度发达，但军事较弱，最终被元朝所灭。",
    moral: "赵匡胤建立宋朝",
    animation: "song-found",
    bgColor: "#BBDEFB",
    accentColor: "#1565C0"
  },
  {
    verse: "十八传，南北混",
    pinyin: "shí bā chuán, nán běi hùn",
    story: "宋朝传了十八代皇帝，分为北宋和南宋。北宋时北方有辽国和金国，南宋时北方有蒙古。岳飞抗金的故事就发生在南宋时期，岳母刺字精忠报国的故事流传至今。",
    moral: "宋朝分南北宋",
    animation: "song-north-south",
    bgColor: "#C5E1A5",
    accentColor: "#558B2F"
  },
  {
    verse: "辽与金，皆称帝",
    pinyin: "liao yu jin, jie cheng di",
    story: "宋朝时期，北方还有辽、金等政权，它们也自称皇帝。中国历史有时统一，有时并立，读史要看清时代格局。",
    moral: "辽金与宋并立",
    animation: "song-liao-jin",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "元灭金，绝宋世",
    pinyin: "yuan mie jin, jue song shi",
    story: "蒙古兴起后建立元朝，先灭金，后来又灭南宋。宋朝到此结束，中国进入元朝统一时期。",
    moral: "元朝终结宋金格局",
    animation: "yuan-dynasty",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "舆图广，超前代",
    pinyin: "yu tu guang, chao qian dai",
    story: "元朝疆域辽阔，交通和交流范围超过许多前代。广阔的版图也带来了复杂的治理难题。",
    moral: "元朝版图辽阔",
    animation: "yuan-dynasty",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "九十年，国祚废",
    pinyin: "jiu shi nian, guo zuo fei",
    story: "元朝统治约九十年后走向衰亡。朝代会兴起也会衰落，关键在于能否安定民生、善用制度。",
    moral: "元朝约九十年而亡",
    animation: "yuan-dynasty",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "太祖兴，国大明",
    pinyin: "tai zu xing, guo da ming",
    story: "朱元璋兴起，建立明朝，国号大明。他从艰难环境中起步，最终结束元末混乱局面。",
    moral: "朱元璋建立明朝",
    animation: "ming-dynasty",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "号洪武，都金陵",
    pinyin: "hao hong wu, du jin ling",
    story: "朱元璋年号洪武，最初定都金陵。明初重建制度、恢复生产，让社会逐步安定。",
    moral: "洪武定都金陵",
    animation: "ming-dynasty",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "迨成祖，迁燕京",
    pinyin: "dai cheng zu, qian yan jing",
    story: "到了明成祖朱棣，他把都城迁到燕京，也就是后来的北京。北京从此成为重要政治中心。",
    moral: "明成祖迁都北京",
    animation: "ming-dynasty",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "十六世，至崇祯",
    pinyin: "shi liu shi, zhi chong zhen",
    story: "明朝传了十六位皇帝，到崇祯帝时灭亡。一个朝代的长短，与政治清明和民生安定密切相关。",
    moral: "明朝十六世至崇祯",
    animation: "ming-dynasty",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "权阉肆，寇如林",
    pinyin: "quan yan si, kou ru lin",
    story: "明末宦官专权，流寇四起，国家内外问题不断累积。历史提醒人们，权力失控会伤害百姓和国家。",
    moral: "明末内乱严重",
    animation: "ming-fall",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "李闯出，神器焚",
    pinyin: "li chuang chu, shen qi fen",
    story: "李自成起兵攻入北京，明朝灭亡。所谓神器，是古人对皇权的说法，这里指国家政权结束。",
    moral: "李自成攻入北京",
    animation: "ming-fall",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "清世祖，膺景命",
    pinyin: "qing shi zu, ying jing ming",
    story: "清世祖顺治入主中原，清朝开始统治全国。新的朝代要稳定天下，也要面对融合和治理的考验。",
    moral: "清世祖入主中原",
    animation: "qing-dynasty",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "靖四方，克大定",
    pinyin: "jing si fang, ke da ding",
    story: "清初经过战争和治理，逐步平定四方。社会安定来之不易，需要制度、人才和民生共同支撑。",
    moral: "清初平定四方",
    animation: "qing-dynasty",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "由康雍，历乾嘉",
    pinyin: "you kang yong, li qian jia",
    story: "康熙、雍正、乾隆、嘉庆时期，清朝经历了较长的稳定发展。这个阶段常被称为清代盛世的一部分。",
    moral: "康雍乾嘉时期",
    animation: "qing-prosperity",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "民安富，治绩夸",
    pinyin: "min an fu, zhi ji kua",
    story: "在较安定的时期，百姓生活改善，国家治理也有成绩。但盛世也需要警惕问题积累，不能只看表面繁荣。",
    moral: "安定富足也要自省",
    animation: "qing-prosperity",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "道咸间，变乱起",
    pinyin: "dao xian jian, bian luan qi",
    story: "道光、咸丰年间，内忧外患增多，社会动荡开始加剧。中国近代的许多变化由此展开。",
    moral: "道咸年间变乱起",
    animation: "late-qing",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "始英法，扰都鄙",
    pinyin: "shi ying fa, rao du bi",
    story: "英法等西方国家侵扰中国，战争影响到都城和地方。近代史提醒我们，国家落后就容易受欺侮。",
    moral: "英法侵扰中国",
    animation: "late-qing",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "同光后，宣统弱",
    pinyin: "tong guang hou, xuan tong ruo",
    story: "同治、光绪以后，清朝虽然尝试改革，但积弊很深。到宣统时，皇权已经十分衰弱。",
    moral: "晚清国势衰弱",
    animation: "late-qing",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "传九帝，满清殁",
    pinyin: "chuan jiu di, man qing mo",
    story: "清朝从入关后的顺治到宣统，共经历九位皇帝，最终结束。中国两千多年的皇帝制度也走到末期。",
    moral: "清朝九帝后灭亡",
    animation: "late-qing",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "革命兴，废帝制",
    pinyin: "ge ming xing, fei di zhi",
    story: "辛亥革命兴起，推翻帝制。中国从皇帝统治转向共和制度，这是近代历史的大转折。",
    moral: "辛亥革命废除帝制",
    animation: "republic",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "立宪法，建民国",
    pinyin: "li xian fa, jian min guo",
    story: "建立民国意味着国家治理要依靠宪法和公共制度。它体现了近代中国追求共和与法治的努力。",
    moral: "立宪建民国",
    animation: "republic",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "古今史，全在兹",
    pinyin: "gu jin shi, quan zai zi",
    story: "从上古到近代的历史脉络，前面的句子已经大略说完。读史不是背朝代名，而是理解兴亡原因。",
    moral: "古今历史大略在此",
    animation: "history-summary",
    bgColor: "#F1F8E9",
    accentColor: "#558B2F"
  },
  {
    verse: "载治乱，知兴衰",
    pinyin: "zai zhi luan, zhi xing shuai",
    story: "史书记载天下太平和战乱的原因，也能让人知道国家为什么兴盛、为什么衰败。",
    moral: "读史知兴衰",
    animation: "history-summary",
    bgColor: "#E3F2FD",
    accentColor: "#1565C0"
  },
  {
    verse: "读史者，考实录",
    pinyin: "du shi zhe, kao shi lu",
    story: "读历史的人要查考真实记录，不能只听传闻。可靠证据越多，判断就越接近事实。",
    moral: "读史要重证据",
    animation: "history-method",
    bgColor: "#FFFDE7",
    accentColor: "#F57F17"
  },
  {
    verse: "通古今，若亲目",
    pinyin: "tong gu jin, ruo qin mu",
    story: "把古今事情联系起来读，就像亲眼看见历史发生一样。历史能帮助我们理解今天，也能提醒未来。",
    moral: "通古今如亲见",
    animation: "history-method",
    bgColor: "#ECEFF1",
    accentColor: "#455A64"
  },
  {
    verse: "口而诵，心而惟",
    pinyin: "kou er song, xin er wei",
    story: "读书不只是嘴上背诵，还要在心里思考。只会背不会想，知识就不能真正变成自己的本领。",
    moral: "诵读还要思考",
    animation: "study-method",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "朝于斯，夕于斯",
    pinyin: "zhao yu si, xi yu si",
    story: "早晨学习，晚上也学习，是说要长期坚持。每天进步一点，时间久了就会有大收获。",
    moral: "朝夕坚持学习",
    animation: "study-method",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  // ========== 第八部分：勤学故事 ==========
  {
    verse: "昔仲尼，师项橐",
    pinyin: "xī zhòng ní, shī xiàng tuó",
    story: "从前孔子（字仲尼）非常好学，他听说有个叫项橐的小孩很聪明，只有七岁，就虚心拜他为师。孔子说：三人行，必有我师焉。意思是任何人都有值得我们学习的地方。",
    moral: "孔子也拜小孩为师",
    animation: "confucius-study",
    bgColor: "#FFF9C4",
    accentColor: "#F9A825"
  },
  {
    verse: "古圣贤，尚勤学",
    pinyin: "gǔ shèng xián, shàng qín xué",
    story: "古代的圣贤孔子尚且这样勤奋好学，我们普通人就更应该努力学习了。勤能补拙，勤奋可以弥补先天的不足。只要肯努力，每个人都可以变得优秀。",
    moral: "圣贤都在勤学，何况我们",
    animation: "ancient-diligent",
    bgColor: "#FFE0B2",
    accentColor: "#EF6C00"
  },
  {
    verse: "赵中令，读鲁论",
    pinyin: "zhao zhong ling, du lu lun",
    story: "赵普做了宰相后仍然认真读《论语》。他明白做官也要继续学习，用经典中的道理帮助处理国家大事。",
    moral: "做官以后仍勤学",
    animation: "zhao-pu",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "彼既仕，学且勤",
    pinyin: "bi ji shi, xue qie qin",
    story: "赵普已经有官职和地位，仍然勤奋读书。学习不是为了考试结束就停止，而是一生都要做的事。",
    moral: "有成就也要继续学",
    animation: "zhao-pu",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "披蒲编，削竹简",
    pinyin: "pi pu bian, xue zhu jian",
    story: "古代没有纸书时，有人把蒲草编起来、把竹片削平来写字读书。条件艰苦，却挡不住求学的心。",
    moral: "无纸也要想办法读书",
    animation: "hard-study",
    bgColor: "#E8EAF6",
    accentColor: "#303F9F"
  },
  {
    verse: "彼无书，且知勉",
    pinyin: "bi wu shu, qie zhi mian",
    story: "那些人没有现成书本，仍然知道勉励自己学习。今天书本和工具更容易得到，更应该珍惜机会。",
    moral: "条件不足仍要自勉",
    animation: "hard-study",
    bgColor: "#FCE4EC",
    accentColor: "#C2185B"
  },
  {
    verse: "头悬梁，锥刺股",
    pinyin: "tóu xuán liáng, zhuī cì gǔ",
    story: "汉朝有个叫孙敬的人，读书时怕打瞌睡，就把头发系在屋梁上；战国时有个叫苏秦的人，读书困了就用锥子扎自己的大腿。这就是头悬梁锥刺股的故事，形容学习非常刻苦。",
    moral: "古人学习非常刻苦",
    animation: "head-hair",
    bgColor: "#D7CCC8",
    accentColor: "#5D4037"
  },
  {
    verse: "彼不教，自勤苦",
    pinyin: "bǐ bù jiāo, zì qín kǔ",
    story: "孙敬和苏秦没有人督促他们，是他们自己主动刻苦学习的。学习是自己的事，不能总让父母老师催着学。要主动学习，把要我学变成我要学。",
    moral: "学习要主动自觉",
    animation: "self-study",
    bgColor: "#C5E1A5",
    accentColor: "#33691E"
  },
  {
    verse: "如囊萤，如映雪",
    pinyin: "rú náng yíng, rú yìng xuě",
    story: "晋朝有个叫车胤的孩子，家里穷买不起灯油，夏天就抓萤火虫装在纱袋里，借荧光读书；还有个叫孙康的，冬天借雪的反光读书。他们虽贫穷却不放弃学习。",
    moral: "贫不失志苦读书",
    animation: "firefly-snow",
    bgColor: "#B3E5FC",
    accentColor: "#0288D1"
  },
  {
    verse: "家虽贫，学不辍",
    pinyin: "jiā suī pín, xué bú chuò",
    story: "他们家里虽然贫穷，却从不停止学习。现在我们生活条件好了，有电灯有课本，更应该珍惜机会好好学习。学习不需要奢华的条件，需要的是一颗求知的心。",
    moral: "贫穷不停止学习",
    animation: "poor-study",
    bgColor: "#E1BEE7",
    accentColor: "#7B1FA2"
  },
  {
    verse: "如负薪，如挂角",
    pinyin: "ru fu xin, ru gua jiao",
    story: "朱买臣背柴时还读书，李密把书挂在牛角上边走边读。他们把零碎时间用起来，所以贫苦和忙碌没有拦住学习。",
    moral: "再忙也能挤时间学习",
    animation: "hard-study",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "身虽劳，犹苦卓",
    pinyin: "shen sui lao, you ku zhuo",
    story: "身体虽然劳累，他们仍然刻苦努力。学习最怕找借口，真正有志气的人会在困难里坚持。",
    moral: "劳苦中仍坚持",
    animation: "hard-study",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "苏老泉，二十七",
    pinyin: "sū lǎo quán, èr shí qī",
    story: "宋朝有个叫苏洵的人（号老泉），二十七岁才开始发愤读书。他年轻时不爱读书，后来觉悟了，关起门来苦读，终于成了大学问家。他和两个儿子苏轼、苏辙合称三苏。",
    moral: "苏洵二十七岁始发愤",
    animation: "su-old-study",
    bgColor: "#FFCDD2",
    accentColor: "#C62828"
  },
  {
    verse: "始发愤，读书籍",
    pinyin: "shǐ fā fèn, dú shū jí",
    story: "苏洵二十七岁才开始发奋读书，后来成了唐宋八大家之一。这个故事告诉我们：学习永远不晚！只要肯努力，什么时候开始都不迟。当然，越早开始越好啦！",
    moral: "学习永远不嫌晚",
    animation: "never-too-late",
    bgColor: "#F8BBD0",
    accentColor: "#AD1457"
  },
  {
    verse: "彼既老，犹悔迟",
    pinyin: "bi ji lao, you hui chi",
    story: "苏洵年纪不小才开始发愤读书，还后悔自己醒悟得太晚。这个故事提醒孩子，学习越早开始越好。",
    moral: "晚学会后悔迟",
    animation: "su-xun",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "尔小生，宜早思",
    pinyin: "er xiao sheng, yi zao si",
    story: "小朋友现在正是学习的好时候，应当早早立志。把今天的时间用好，将来就少一些后悔。",
    moral: "小学生要早立志",
    animation: "su-xun",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "若梁灏，八十二",
    pinyin: "ruò liáng hào, bā shí èr",
    story: "宋朝有个叫梁灏的人，八十二岁才考中状元。他从年轻时就参加科举考试，年年不中，但从不放弃，一直考到八十二岁终于中了状元！皇帝和满朝大臣都被他的毅力感动了。",
    moral: "梁灏八十二岁中状元",
    animation: "lianghao-old",
    bgColor: "#FFF9C4",
    accentColor: "#F57F17"
  },
  {
    verse: "对大廷，魁多士",
    pinyin: "duì dà tíng, kuí duō shì",
    story: "梁灏在金銮殿上面对皇帝的提问，对答如流，才华超过了所有年轻的考生。有志不在年高，无志空长百岁。年龄不是问题，志向和毅力才是成功的关键。",
    moral: "年老照样可以成才",
    animation: "old-success",
    bgColor: "#BBDEFB",
    accentColor: "#1565C0"
  },
  {
    verse: "彼既成，众称异",
    pinyin: "bi ji cheng, zhong cheng yi",
    story: "梁灏年纪很大才考中状元，大家都称奇。成功有早有晚，坚持到底的人才有机会看到结果。",
    moral: "晚成也值得敬佩",
    animation: "liang-hao",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "尔小生，宜立志",
    pinyin: "er xiao sheng, yi li zhi",
    story: "孩子看到梁灏的故事，更应该早早立志。目标明确，学习才有方向；方向稳定，努力才不会散。",
    moral: "从小立志更重要",
    animation: "liang-hao",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "莹八岁，能咏诗",
    pinyin: "yíng bā suì, néng yǒng shī",
    story: "北齐有个叫祖莹的孩子，八岁就能吟诗作文。他小时候非常爱读书，父母担心他累坏身体不让他看，他就偷偷在晚上点蜡烛读书。后来他成了著名的文学家。",
    moral: "祖莹八岁能吟诗",
    animation: "zuying-poem",
    bgColor: "#C8E6C9",
    accentColor: "#2E7D32"
  },
  {
    verse: "泌七岁，能赋棋",
    pinyin: "mì qī suì, néng fù qí",
    story: "唐朝有个叫李泌的孩子，七岁时就写出了关于下棋的文章。当时皇帝召见了他，让宰相张说考验他。李泌当场以棋为题作了一首诗，在场的人都惊叹他的才华。",
    moral: "李泌七岁能写文",
    animation: "limi-chess",
    bgColor: "#E1BEE7",
    accentColor: "#6A1B9A"
  },
  {
    verse: "彼颖悟，人称奇",
    pinyin: "bi ying wu, ren cheng qi",
    story: "祖莹和李泌都很聪明，才华早早显露。聪明值得称赞，但更重要的是继续学习，不让天资白白浪费。",
    moral: "聪明还要努力",
    animation: "young-talents",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "尔幼学，当效之",
    pinyin: "er you xue, dang xiao zhi",
    story: "小朋友学习时，可以效法他们勤读善思。不是每个人都要做神童，但每个人都能每天进步。",
    moral: "效法勤学的孩子",
    animation: "young-talents",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  {
    verse: "蔡文姬，能辨琴",
    pinyin: "cài wén jī, néng biàn qín",
    story: "东汉有个才女叫蔡文姬，她的父亲蔡邕是著名的音乐家和学者。蔡文姬从小听父亲弹琴，能分辨弹的是什么曲子。有一次父亲弹琴断了一根弦，她一听就知道是第几根。",
    moral: "蔡文姬能辨琴声",
    animation: "caiwenji-qin",
    bgColor: "#FFE0B2",
    accentColor: "#E65100"
  },
  {
    verse: "谢道韫，能咏吟",
    pinyin: "xiè dào yùn, néng yǒng yín",
    story: "东晋有个才女叫谢道韫。有一次下雪，叔叔谢安问：白雪纷纷何所似？侄子说：撒盐空中差可拟。谢道韫说：未若柳絮因风起。用柳絮比喻雪花，非常优雅。从此咏絮之才就用来称赞才女。",
    moral: "谢道韫吟诗咏雪",
    animation: "xiedaoyun-poem",
    bgColor: "#B3E5FC",
    accentColor: "#0288D1"
  },
  {
    verse: "彼女子，且聪敏",
    pinyin: "bǐ nǚ zǐ, qiě cōng mǐn",
    story: "蔡文姬和谢道韫都是女孩子，都很聪明有才。女孩子和男孩子一样聪明。过去有人说女孩不用读书，这是不对的。男孩女孩都要好好学习，一样可以成才。",
    moral: "女孩子也很聪明",
    animation: "girl-smart",
    bgColor: "#F8BBD0",
    accentColor: "#EC407A"
  },
  {
    verse: "尔男子，当自警",
    pinyin: "ěr nán zǐ, dāng zì jǐng",
    story: "男孩子看到女孩子这么聪明有才华，更应该警醒自己，努力学习。男孩子不比女孩子聪明，不努力一样会落后。无论男生女生，都要勤奋学习才能成才。",
    moral: "男生更要努力",
    animation: "boy-alert",
    bgColor: "#BBDEFB",
    accentColor: "#1565C0"
  },
  {
    verse: "唐刘晏，方七岁",
    pinyin: "táng liú yàn, fāng qī suì",
    story: "唐朝有个叫刘晏的孩子，七岁就被推荐为神童，做了专门负责校正书籍的官。唐玄宗召见了他，当场考他学问，刘晏对答如流，皇帝非常高兴，当场赐给他进士头衔。",
    moral: "刘晏七岁当小官",
    animation: "liuyan-child",
    bgColor: "#FFF8E1",
    accentColor: "#FF8F00"
  },
  {
    verse: "举神童，作正字",
    pinyin: "jǔ shén tóng, zuò zhèng zì",
    story: "刘晏被举荐为神童，做了校正书籍的官职。他长大后成了唐朝著名的理财大臣，为国家管理财政做出了巨大贡献。小时候的聪明加上后天的努力，成就了他的一生。",
    moral: "神童也要努力",
    animation: "child-official",
    bgColor: "#DCEDC8",
    accentColor: "#558B2F"
  },
  {
    verse: "彼虽幼，身已仕",
    pinyin: "bi sui you, shen yi shi",
    story: "刘晏虽然年纪小，却已经因为才学被任用。这个例子说明，真正的能力会让人承担责任。",
    moral: "年幼有才也能任事",
    animation: "liuyan-child",
    bgColor: "#E0F2F1",
    accentColor: "#00695C"
  },
  {
    verse: "有为者，亦若是",
    pinyin: "you wei zhe, yi ruo shi",
    story: "有志向、有行动的人，也可以像这些勤学者一样有所作为。关键不是空想，而是从今天开始认真做。",
    moral: "有志者要行动",
    animation: "liuyan-child",
    bgColor: "#FFF3E0",
    accentColor: "#E65100"
  },
  // ========== 第九部分：劝学总结 ==========
  {
    verse: "犬守夜，鸡司晨",
    pinyin: "quǎn shǒu yè, jī sī chén",
    story: "狗会在夜里看家，公鸡会在早晨报晓。动物都有自己的职责和本领。狗晚上不睡觉就是为了守护主人，公鸡天不亮就打鸣叫醒人们。动物都这么尽职，人更应该有一技之长。",
    moral: "动物都有自己的本领",
    animation: "dog-rooster",
    bgColor: "#FFECB3",
    accentColor: "#FF6F00"
  },
  {
    verse: "苟不学，曷为人",
    pinyin: "gǒu bù xué, hé wéi rén",
    story: "如果不学习，没有一技之长，怎么配称作人呢？人之所以为人，就是因为能学习、有智慧。不学习就会一事无成，连动物都不如。学习是每个人的本分。",
    moral: "不学无术就不配做人",
    animation: "human-learn",
    bgColor: "#CFD8DC",
    accentColor: "#455A64"
  },
  {
    verse: "蚕吐丝，蜂酿蜜",
    pinyin: "cán tǔ sī, fēng niàng mì",
    story: "蚕会吐丝，蜜蜂会酿蜜。蚕吃的是桑叶，吐出的是可以做衣服的蚕丝；蜜蜂采的是花蜜，酿出的是甜美的蜂蜜。小小的动物都在为人类做贡献，我们更应该好好学习为社会服务。",
    moral: "蚕和蜂都为人类服务",
    animation: "silkworm-bee",
    bgColor: "#FFF9C4",
    accentColor: "#F9A825"
  },
  {
    verse: "人不学，不如物",
    pinyin: "rén bù xué, bù rú wù",
    story: "人如果不学习，没有本领，还不如这些小动物呢！至少蚕能吐丝、蜂能酿蜜。不学习的人能做什么呢？只能成为社会的负担。所以要好好学习，成为对社会有用的人。",
    moral: "人不学不如小动物",
    animation: "better-than-animal",
    bgColor: "#FFCCBC",
    accentColor: "#BF360C"
  },
  {
    verse: "幼而学，壮而行",
    pinyin: "yòu ér xué, zhuàng ér xíng",
    story: "年轻时努力学习知识和本领，长大后就要把学到的知识付诸实践。学习是为了用的，不是为了装门面。学了很多知识却不会用，那就成了书呆子。要做到学以致用。",
    moral: "幼时学习，长大实践",
    animation: "young-learn",
    bgColor: "#C5E1A5",
    accentColor: "#558B2F"
  },
  {
    verse: "上致君，下泽民",
    pinyin: "shàng zhì jūn, xià zé mín",
    story: "学好了本领，上可以报效国家，下可以造福百姓。有本领的人可以当科学家、医生、老师、工程师，为社会做贡献。我们学习不仅是为了自己好，也是为了让世界更美好。",
    moral: "报效国家，造福百姓",
    animation: "serve-country",
    bgColor: "#BBDEFB",
    accentColor: "#1565C0"
  },
  {
    verse: "扬名声，显父母",
    pinyin: "yáng míng shēng, xiǎn fù mǔ",
    story: "事业有成后，名声传扬，也让父母感到光荣。孩子有出息，是对父母最大的孝顺。但要注意：不要为了出名而学习，学习是为了学本事、做好事，名声是自然而来的。",
    moral: "成功让父母感到光荣",
    animation: "famous-family",
    bgColor: "#FFECB3",
    accentColor: "#FF6F00"
  },
  {
    verse: "光于前，裕于后",
    pinyin: "guāng yú qián, yù yú hòu",
    story: "给祖先增添光彩，给后代留下财富。遗产最好不是金钱，而是品德和学问。金钱会花完，但好品德和好学问会让后代受益无穷。给子孙留金不如留经。",
    moral: "光宗耀祖，造福后代",
    animation: "honor-ancestors",
    bgColor: "#F8BBD0",
    accentColor: "#C2185B"
  },
  {
    verse: "人遗子，金满籯",
    pinyin: "rén yí zǐ, jīn mǎn yíng",
    story: "一般人留给子孙后代的是满筐的金银财宝。很多父母拼命赚钱，想给孩子留下很多钱，让孩子不愁吃穿。但这不一定是好事，因为钱多了孩子可能就不努力学习了。",
    moral: "一般人留金钱给子孙",
    animation: "gold-legacy",
    bgColor: "#FFF9C4",
    accentColor: "#F9A825"
  },
  {
    verse: "我教子，惟一经",
    pinyin: "wǒ jiào zǐ, wéi yī jīng",
    story: "而三字经的作者王应麟说，他教育子孙只有这一本三字经。授人以鱼不如授人以渔，给孩子金钱不如教孩子做人的道理和谋生的本领。知识和品德才是取之不尽的财富。",
    moral: "我只教孩子一本经",
    animation: "classic-legacy",
    bgColor: "#E1BEE7",
    accentColor: "#6A1B9A"
  },
  {
    verse: "勤有功，戏无益",
    pinyin: "qín yǒu gōng, xì wú yì",
    story: "勤奋学习一定会有收获，贪玩嬉戏是没有好处的。一分耕耘一分收获，付出多少努力就会有多少回报。勤奋的人每天都在进步，贪玩的人每天都在退步。",
    moral: "勤奋有收获，贪玩没好处",
    animation: "diligence-play",
    bgColor: "#C8E6C9",
    accentColor: "#388E3C"
  },
  {
    verse: "戒之哉，宜勉力",
    pinyin: "jiè zhī zāi, yí miǎn lì",
    story: "要以此为戒啊！应该勉励自己，努力学习。这是三字经的最后两句，也是对所有读者的忠告。学习没有捷径，只有勤奋努力。希望每一个小朋友都能认真读书，成为有用之才！",
    moral: "要以此为戒，努力学习",
    animation: "final-warning",
    bgColor: "#FFE0B2",
    accentColor: "#E65100"
  }
];
