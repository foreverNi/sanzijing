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
    verse: "周武王，称三王",
    pinyin: "zhōu wǔ wáng, chēng sān wáng",
    story: "周武王灭了商朝，建立了周朝。大禹、商汤、周武王这三位贤明的君主合称为三王。他们都有一个共同点：爱护百姓、任用贤人、以德治国，所以得到了天下人的拥护。",
    moral: "三王都是贤明君主",
    animation: "three-kings",
    bgColor: "#CFD8DC",
    accentColor: "#37474F"
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
