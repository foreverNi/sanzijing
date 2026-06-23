$ErrorActionPreference = "Stop"

$scriptRoot = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($scriptRoot)) {
    $scriptRoot = Join-Path (Get-Location) "android\tools"
}
$repoRoot = Resolve-Path (Join-Path $scriptRoot "..\..")
$dataPath = Join-Path $repoRoot "data.js"
$source = Get-Content -Encoding UTF8 -Raw -Path $dataPath

function Escape-JsString([string]$value) {
    return ($value -replace "\\", "\\" -replace '"', '\"')
}

function New-ClassicPageBlock([object[]]$pages) {
    $palette = @(
        @("#E0F2F1", "#00695C"),
        @("#FFF3E0", "#E65100"),
        @("#E8EAF6", "#303F9F"),
        @("#FCE4EC", "#C2185B"),
        @("#F1F8E9", "#558B2F"),
        @("#E3F2FD", "#1565C0"),
        @("#FFFDE7", "#F57F17"),
        @("#ECEFF1", "#455A64")
    )
    $items = [System.Collections.Generic.List[string]]::new()
    for ($i = 0; $i -lt $pages.Count; $i++) {
        $page = $pages[$i]
        $colors = $palette[$i % $palette.Count]
        $verse = Escape-JsString $page.verse
        $pinyin = Escape-JsString $page.pinyin
        $story = Escape-JsString $page.story
        $moral = Escape-JsString $page.moral
        $animation = Escape-JsString $page.animation
        $items.Add(@"
  {
    verse: "$verse",
    pinyin: "$pinyin",
    story: "$story",
    moral: "$moral",
    animation: "$animation",
    bgColor: "$($colors[0])",
    accentColor: "$($colors[1])"
  }
"@)
    }
    return ($items -join ",`r`n")
}

function Insert-AfterVerse([string]$anchorVerse, [object[]]$pages) {
    if ($pages.Count -eq 0) {
        return
    }
    $firstVerse = [string]$pages[0].verse
    if ($script:source.Contains("verse: `"$firstVerse`"")) {
        Write-Host "Skip existing supplement after $anchorVerse"
        return
    }
    $pattern = '(?s)\{\s*verse:\s*"' + [regex]::Escape($anchorVerse) + '".*?\n\s*\},'
    $match = [regex]::Match($script:source, $pattern)
    if (-not $match.Success) {
        throw "Anchor verse not found: $anchorVerse"
    }
    $block = New-ClassicPageBlock $pages
    $script:source = $script:source.Insert($match.Index + $match.Length, "`r`n" + $block + ",")
    Write-Host "Inserted $($pages.Count) pages after $anchorVerse"
}

function P([string]$verse, [string]$pinyin, [string]$story, [string]$moral, [string]$animation) {
    [pscustomobject]@{
        verse = $verse
        pinyin = $pinyin
        story = $story
        moral = $moral
        animation = $animation
    }
}

$source = $source -replace 'verse: "周武王，称三王"', 'verse: "周文武，称三王"'
$source = $source -replace 'pinyin: "zhōu wǔ wáng, chēng sān wáng"', 'pinyin: "zhōu wén wǔ, chēng sān wáng"'
$source = $source -replace '周武王灭了商朝，建立了周朝。大禹、商汤、周武王这三位贤明的君主合称为三王。', '周文王奠定周朝基础，周武王灭商建立周朝。大禹、商汤、周文王和周武王代表古代贤明君主，其中周文王、周武王合称文武。'

Insert-AfterVerse "此六畜，人所饲" @(
    P "曰喜怒，曰哀惧" "yue xi nu, yue ai ju" "人有喜悦、愤怒、悲哀和害怕等情绪。古人把这些感受写进《三字经》，是提醒孩子先认识自己的心情，遇事不要被情绪牵着走。" "认识喜怒哀惧" "seven-emotions"
    P "爱恶欲，七情具" "ai wu yu, qi qing ju" "喜欢、厌恶和想要也是人的常见情绪。七情人人都有，关键是学会表达和控制，比如生气时先停一停，说清楚原因。" "七情人人都有" "seven-emotions"
    P "匏土革，木石金" "pao tu ge, mu shi jin" "古代乐器可以用葫芦、陶土、皮革、木头、石头和金属制成。不同材料发出的声音不同，合在一起就有了丰富的音乐。" "材料不同，声音不同" "eight-sounds"
    P "丝与竹，乃八音" "si yu zhu, nai ba yin" "丝弦和竹管也能制成乐器。加上前面的六类材料，合称八音。音乐让礼仪更庄重，也让生活更温和美好。" "八音组成古代音乐" "eight-sounds"
    P "高曾祖，父而身" "gao zeng zu, fu er shen" "从高祖、曾祖、祖父到父亲，再到自己，这是一条家族传承的线。每个人都不是孤零零来的，身后有长辈的养育和期望。" "记住家族传承" "family-line"
    P "身而子，子而孙" "shen er zi, zi er sun" "从自己往后，是子女和孙辈。家风会一代一代传下去，所以今天养成诚实、勤学、孝顺的习惯，也会影响将来的家庭。" "好家风代代传" "family-line"
    P "自子孙，至玄曾" "zi zi sun, zhi xuan zeng" "从子孙再往后，还会有曾孙、玄孙。古人用这些称呼帮助孩子认识亲族关系，也提醒大家珍惜亲人之间的联系。" "认识后代称谓" "family-line"
    P "乃九族，人之伦" "nai jiu zu, ren zhi lun" "上自高祖，下至玄孙，合起来就是九族。懂得亲族伦常，才知道尊敬长辈、爱护晚辈、和睦相处。" "九族体现人伦" "family-line"
    P "父子恩，夫妇从" "fu zi en, fu fu cong" "父母和子女之间重在恩爱，夫妻之间重在互相扶持。家庭里的每个人都尽自己的责任，家里才会安稳温暖。" "家庭关系要有恩和顺" "ten-duties"
    P "兄则友，弟则恭" "xiong ze you, di ze gong" "哥哥姐姐要友爱弟妹，弟弟妹妹要尊敬兄姐。兄弟姐妹不是用来争抢的，而是一起成长、彼此帮助的亲人。" "兄友弟恭" "ten-duties"
    P "长幼序，友与朋" "zhang you xu, you yu peng" "长辈和晚辈相处要有次序，朋友之间要讲信义。排队、让座、守约，都是把这些道理用在生活里。" "长幼有序，朋友守信" "ten-duties"
    P "君则敬，臣则忠" "jun ze jing, chen ze zhong" "古代讲君臣关系，君主要尊重臣子，臣子要尽忠职守。放到今天，就是负责人要公平待人，做事的人要认真负责。" "彼此尊重，各尽职责" "ten-duties"
    P "此十义，人所同" "ci shi yi, ren suo tong" "父子、夫妇、兄弟、长幼、朋友和君臣这些关系中，都有应守的义理。做人先明白责任，社会才会有秩序。" "十义是共同准则" "ten-duties"
    P "凡训蒙，须讲究" "fan xun meng, xu jiang jiu" "教育刚开始学习的孩子，不能随便糊弄。老师和父母要认真选择内容、方法和次序，让孩子一步一步打好根基。" "启蒙教育要认真" "early-learning"
    P "详训诂，明句读" "xiang xun gu, ming ju dou" "读古书要懂字词意思，也要知道哪里停顿。标点和解释看似小事，却能决定一句话是否读对、理解对。" "读书要懂字义和停顿" "early-learning"
    P "为学者，必有初" "wei xue zhe, bi you chu" "做学问一定有起点。先认字、读句、懂礼，再慢慢读经典，就像盖房子要先打地基一样。" "学习要从基础开始" "early-learning"
    P "小学终，至四书" "xiao xue zhong, zhi si shu" "启蒙基础学完后，就可以继续学习《论语》《孟子》《中庸》《大学》四书。学习要循序渐进，不能急着跳级。" "基础之后读四书" "early-learning"
)

Insert-AfterVerse "自修齐，至平治" @(
    P "孝经通，四书熟" "xiao jing tong, si shu shu" "《孝经》讲孝道，四书讲做人和治学。把这些内容读通读熟，孩子就能懂得尊亲、修身和处世的根本道理。" "通孝经，熟四书" "classic-study"
    P "如六经，始可读" "ru liu jing, shi ke du" "基础经典熟悉之后，才适合继续读更深的六经。学习像登山，一层一层往上走，才不会迷路。" "先打基础再读六经" "classic-study"
    P "诗书易，礼春秋" "shi shu yi, li chun qiu" "六经包括《诗》《书》《易》《礼》《乐》《春秋》。后来《乐经》失传，常以诗、书、易、礼、春秋为核心来学习。" "认识儒家经典" "six-classics"
    P "号六经，当讲求" "hao liu jing, dang jiang qiu" "这些经典记录了古人的政治、礼仪、历史和思想。读它们不能只背字句，还要认真讲解和思考。" "读经要讲求义理" "six-classics"
    P "有连山，有归藏" "you lian shan, you gui cang" "《连山》和《归藏》是古人传说中的两部易书，后来大多失传。它们说明古人很早就尝试用规律理解天地变化。" "古代有多种易书" "three-yi"
    P "有周易，三易详" "you zhou yi, san yi xiang" "加上流传至今的《周易》，合称三易。《周易》讲变化和规律，提醒人做事要观察时势、谨慎选择。" "三易以周易传世" "three-yi"
    P "有典谟，有训诰" "you dian mo, you xun gao" "《尚书》中有典、谟、训、诰等文体，记录古代君臣治国的言论。它们像历史档案，帮助后人了解古代政治。" "尚书保存古代政事" "book-documents"
    P "有誓命，书之奥" "you shi ming, shu zhi ao" "誓和命也是《尚书》里的重要文体，常见于出征、任命和告诫。读懂这些，才能看到《尚书》深奥的一面。" "尚书文体内容深奥" "book-documents"
    P "我周公，作周礼" "wo zhou gong, zuo zhou li" "周公辅佐成王，制定礼乐制度。《周礼》记录了周代官制和礼制，体现古人治理国家重视秩序。" "周公制礼作乐" "zhou-rites"
    P "著六官，存治体" "zhu liu guan, cun zhi ti" "《周礼》按天、地、春、夏、秋、冬六官来安排职责。分工清楚，国家机器才能有条不紊地运转。" "六官体现治理体系" "zhou-rites"
    P "大小戴，注礼记" "da xiao dai, zhu li ji" "汉代大戴、小戴整理和注解礼学文献，形成《礼记》等内容。许多关于礼仪、学习和修身的名篇都保存在其中。" "大小戴整理礼学" "book-rites"
    P "述圣言，礼乐备" "shu sheng yan, li yue bei" "《礼记》记述圣贤关于礼乐的言论。礼让人有规矩，乐让人心平和，礼乐相配才能教化人心。" "礼乐共同教化人" "book-rites"
    P "曰国风，曰雅颂" "yue guo feng, yue ya song" "《诗经》分为国风、雅、颂。国风多来自民间歌谣，雅和颂多用于朝廷和祭祀，能看到古人的生活和情感。" "诗经分风雅颂" "book-poetry"
    P "号四诗，当讽咏" "hao si shi, dang feng yong" "《诗经》的内容适合反复诵读。读诗不是只看字面，还要体会声音、节奏和情感。" "读诗要反复吟诵" "book-poetry"
    P "诗既亡，春秋作" "shi ji wang, chun qiu zuo" "周代采诗制度衰落后，孔子整理《春秋》。这部书用简洁文字记录鲁国历史，也寄托了是非判断。" "春秋记录历史褒贬" "spring-autumn"
    P "寓褒贬，别善恶" "yu bao bian, bie shan e" "《春秋》写事很简短，却暗含赞许和批评。读历史要分清善恶，知道什么值得学习，什么应该警惕。" "历史能辨善恶" "spring-autumn"
    P "三传者，有公羊" "san zhuan zhe, you gong yang" "解释《春秋》的书有三传，其中一部是《公羊传》。它帮助后人理解《春秋》简短文字背后的意思。" "公羊传解释春秋" "three-commentaries"
    P "有左氏，有谷梁" "you zuo shi, you gu liang" "另外两部是《左传》和《谷梁传》。《左传》故事详细，《谷梁传》重在义理，三传合看更完整。" "三传合解春秋" "three-commentaries"
    P "经既明，方读子" "jing ji ming, fang du zi" "经书的根本道理明白后，再去读诸子百家的书。先有主干，再看分支，知识就不会散乱。" "先明经，再读子" "classic-order"
    P "撮其要，记其事" "cuo qi yao, ji qi shi" "读诸子书要抓住要点，也要记住重要事例。只背很多名字没有用，能说出道理和故事才算真正理解。" "读书要抓要点" "classic-order"
    P "五子者，有荀扬" "wu zi zhe, you xun yang" "五子中有荀子和扬雄。荀子重视礼法和学习，扬雄擅长文章与思想，他们都是后人研读的学者。" "认识荀子和扬雄" "five-masters"
    P "文中子，及老庄" "wen zhong zi, ji lao zhuang" "文中子、老子、庄子也列在五子之中。老庄讲自然和逍遥，能让人从另一面思考人生。" "诸子思想各有重点" "five-masters"
    P "经子通，读诸史" "jing zi tong, du zhu shi" "经书和诸子读通之后，就可以读历代史书。历史记录兴衰成败，能帮助人看清事情的来龙去脉。" "通经子后读史" "history-study"
    P "考世系，知终始" "kao shi xi, zhi zhong shi" "读历史要考察朝代世系，知道每件事如何开始、如何结束。这样才不会只记零散故事，而能看见历史脉络。" "读史要明始终" "history-study"
    P "自羲农，至黄帝" "zi xi nong, zhi huang di" "从伏羲、神农到黄帝，是传说中的上古时代。古人用这些人物讲述文明起源，如结网、农耕、医药和制度。" "三皇开文明之始" "ancient-rulers"
    P "号三皇，居上世" "hao san huang, ju shang shi" "伏羲、神农、黄帝常被称为三皇，位于很早的上古时期。它们承载的是古人对文明起点的记忆。" "三皇居上古" "ancient-rulers"
    P "唐有虞，号二帝" "tang you yu, hao er di" "唐尧和虞舜合称二帝。传说他们以德治天下，重视贤能，不把天下当作私产。" "尧舜合称二帝" "ancient-rulers"
    P "相揖逊，称盛世" "xiang yi xun, cheng sheng shi" "尧把帝位禅让给舜，舜又选贤任能。古人把这种谦让和贤德治理称为盛世，提醒后人重德不重私利。" "禅让体现贤德" "ancient-rulers"
)

Insert-AfterVerse "周文武，称三王" @(
    P "夏传子，家天下" "xia chuan zi, jia tian xia" "大禹之后，启继承了王位，夏朝从禅让变成世袭。天下像家族产业一样传给子孙，这就是家天下的开始。" "夏朝开始家天下" "xia-dynasty"
    P "四百载，迁夏社" "si bai zai, qian xia she" "夏朝大约延续四百年，后来国运衰败，被商汤取代。历史告诉我们，国家要长久，不能只靠血统，更要靠德政。" "夏朝四百年后衰亡" "xia-dynasty"
)

Insert-AfterVerse "八百载，最长久" @(
    P "周辙东，王纲坠" "zhou zhe dong, wang gang zhui" "周平王东迁以后，周王室权威下降，诸侯不再像从前那样听命。周朝进入东周，天下秩序开始松动。" "东周王纲坠落" "east-zhou"
    P "逞干戈，尚游说" "cheng gan ge, shang you shui" "诸侯之间常常打仗，谋士也四处游说君主。这个时代虽然纷乱，却也出现了许多思想家和治国主张。" "乱世中百家游说" "east-zhou"
)

Insert-AfterVerse "号三国，迄两晋" @(
    P "宋齐继，梁陈承" "song qi ji, liang chen cheng" "两晋之后，南方先后有宋、齐、梁、陈四个朝代。它们延续时间不长，却在文学、书法和佛教文化上很活跃。" "宋齐梁陈相继" "southern-dynasties"
    P "为南朝，都金陵" "wei nan chao, du jin ling" "宋齐梁陈都把都城设在金陵，也就是今天的南京一带，所以合称南朝。江南文化在这时不断发展。" "南朝都城在金陵" "southern-dynasties"
    P "北元魏，分东西" "bei yuan wei, fen dong xi" "北方的北魏后来分裂成东魏和西魏。南北朝时期，南方和北方政权并立，民族交流也更加频繁。" "北魏分为东西魏" "northern-dynasties"
    P "宇文周，与高齐" "yu wen zhou, yu gao qi" "西魏之后有宇文氏建立北周，东魏之后有高氏建立北齐。北周后来灭北齐，为隋朝统一打下基础。" "北周北齐并立" "northern-dynasties"
    P "迨至隋，一土宇" "dai zhi sui, yi tu yu" "到了隋朝，南北长期分裂的局面终于结束，天下重新统一。统一后交通、制度和文化联系更紧密。" "隋朝重新统一天下" "sui-dynasty"
    P "不再传，失统绪" "bu zai chuan, shi tong xu" "隋朝只传到第二代就灭亡了。隋炀帝劳民伤财，导致天下大乱，说明治理国家不能脱离百姓承受能力。" "隋朝二世而亡" "sui-dynasty"
)

Insert-AfterVerse "梁灭之，国乃改" @(
    P "梁唐晋，及汉周" "liang tang jin, ji han zhou" "唐亡以后，中原先后出现后梁、后唐、后晋、后汉、后周五个朝代。它们更替很快，社会仍不安定。" "五代相继更替" "five-dynasties"
    P "称五代，皆有由" "cheng wu dai, jie you you" "这五个朝代合称五代。它们的兴亡都有原因，读历史要看清背后的民心、制度和用人得失。" "五代兴亡皆有原因" "five-dynasties"
)

Insert-AfterVerse "十八传，南北混" @(
    P "辽与金，皆称帝" "liao yu jin, jie cheng di" "宋朝时期，北方还有辽、金等政权，它们也自称皇帝。中国历史有时统一，有时并立，读史要看清时代格局。" "辽金与宋并立" "song-liao-jin"
    P "元灭金，绝宋世" "yuan mie jin, jue song shi" "蒙古兴起后建立元朝，先灭金，后来又灭南宋。宋朝到此结束，中国进入元朝统一时期。" "元朝终结宋金格局" "yuan-dynasty"
    P "舆图广，超前代" "yu tu guang, chao qian dai" "元朝疆域辽阔，交通和交流范围超过许多前代。广阔的版图也带来了复杂的治理难题。" "元朝版图辽阔" "yuan-dynasty"
    P "九十年，国祚废" "jiu shi nian, guo zuo fei" "元朝统治约九十年后走向衰亡。朝代会兴起也会衰落，关键在于能否安定民生、善用制度。" "元朝约九十年而亡" "yuan-dynasty"
    P "太祖兴，国大明" "tai zu xing, guo da ming" "朱元璋兴起，建立明朝，国号大明。他从艰难环境中起步，最终结束元末混乱局面。" "朱元璋建立明朝" "ming-dynasty"
    P "号洪武，都金陵" "hao hong wu, du jin ling" "朱元璋年号洪武，最初定都金陵。明初重建制度、恢复生产，让社会逐步安定。" "洪武定都金陵" "ming-dynasty"
    P "迨成祖，迁燕京" "dai cheng zu, qian yan jing" "到了明成祖朱棣，他把都城迁到燕京，也就是后来的北京。北京从此成为重要政治中心。" "明成祖迁都北京" "ming-dynasty"
    P "十六世，至崇祯" "shi liu shi, zhi chong zhen" "明朝传了十六位皇帝，到崇祯帝时灭亡。一个朝代的长短，与政治清明和民生安定密切相关。" "明朝十六世至崇祯" "ming-dynasty"
    P "权阉肆，寇如林" "quan yan si, kou ru lin" "明末宦官专权，流寇四起，国家内外问题不断累积。历史提醒人们，权力失控会伤害百姓和国家。" "明末内乱严重" "ming-fall"
    P "李闯出，神器焚" "li chuang chu, shen qi fen" "李自成起兵攻入北京，明朝灭亡。所谓神器，是古人对皇权的说法，这里指国家政权结束。" "李自成攻入北京" "ming-fall"
    P "清世祖，膺景命" "qing shi zu, ying jing ming" "清世祖顺治入主中原，清朝开始统治全国。新的朝代要稳定天下，也要面对融合和治理的考验。" "清世祖入主中原" "qing-dynasty"
    P "靖四方，克大定" "jing si fang, ke da ding" "清初经过战争和治理，逐步平定四方。社会安定来之不易，需要制度、人才和民生共同支撑。" "清初平定四方" "qing-dynasty"
    P "由康雍，历乾嘉" "you kang yong, li qian jia" "康熙、雍正、乾隆、嘉庆时期，清朝经历了较长的稳定发展。这个阶段常被称为清代盛世的一部分。" "康雍乾嘉时期" "qing-prosperity"
    P "民安富，治绩夸" "min an fu, zhi ji kua" "在较安定的时期，百姓生活改善，国家治理也有成绩。但盛世也需要警惕问题积累，不能只看表面繁荣。" "安定富足也要自省" "qing-prosperity"
    P "道咸间，变乱起" "dao xian jian, bian luan qi" "道光、咸丰年间，内忧外患增多，社会动荡开始加剧。中国近代的许多变化由此展开。" "道咸年间变乱起" "late-qing"
    P "始英法，扰都鄙" "shi ying fa, rao du bi" "英法等西方国家侵扰中国，战争影响到都城和地方。近代史提醒我们，国家落后就容易受欺侮。" "英法侵扰中国" "late-qing"
    P "同光后，宣统弱" "tong guang hou, xuan tong ruo" "同治、光绪以后，清朝虽然尝试改革，但积弊很深。到宣统时，皇权已经十分衰弱。" "晚清国势衰弱" "late-qing"
    P "传九帝，满清殁" "chuan jiu di, man qing mo" "清朝从入关后的顺治到宣统，共经历九位皇帝，最终结束。中国两千多年的皇帝制度也走到末期。" "清朝九帝后灭亡" "late-qing"
    P "革命兴，废帝制" "ge ming xing, fei di zhi" "辛亥革命兴起，推翻帝制。中国从皇帝统治转向共和制度，这是近代历史的大转折。" "辛亥革命废除帝制" "republic"
    P "立宪法，建民国" "li xian fa, jian min guo" "建立民国意味着国家治理要依靠宪法和公共制度。它体现了近代中国追求共和与法治的努力。" "立宪建民国" "republic"
    P "古今史，全在兹" "gu jin shi, quan zai zi" "从上古到近代的历史脉络，前面的句子已经大略说完。读史不是背朝代名，而是理解兴亡原因。" "古今历史大略在此" "history-summary"
    P "载治乱，知兴衰" "zai zhi luan, zhi xing shuai" "史书记载天下太平和战乱的原因，也能让人知道国家为什么兴盛、为什么衰败。" "读史知兴衰" "history-summary"
    P "读史者，考实录" "du shi zhe, kao shi lu" "读历史的人要查考真实记录，不能只听传闻。可靠证据越多，判断就越接近事实。" "读史要重证据" "history-method"
    P "通古今，若亲目" "tong gu jin, ruo qin mu" "把古今事情联系起来读，就像亲眼看见历史发生一样。历史能帮助我们理解今天，也能提醒未来。" "通古今如亲见" "history-method"
    P "口而诵，心而惟" "kou er song, xin er wei" "读书不只是嘴上背诵，还要在心里思考。只会背不会想，知识就不能真正变成自己的本领。" "诵读还要思考" "study-method"
    P "朝于斯，夕于斯" "zhao yu si, xi yu si" "早晨学习，晚上也学习，是说要长期坚持。每天进步一点，时间久了就会有大收获。" "朝夕坚持学习" "study-method"
)

Insert-AfterVerse "古圣贤，尚勤学" @(
    P "赵中令，读鲁论" "zhao zhong ling, du lu lun" "赵普做了宰相后仍然认真读《论语》。他明白做官也要继续学习，用经典中的道理帮助处理国家大事。" "做官以后仍勤学" "zhao-pu"
    P "彼既仕，学且勤" "bi ji shi, xue qie qin" "赵普已经有官职和地位，仍然勤奋读书。学习不是为了考试结束就停止，而是一生都要做的事。" "有成就也要继续学" "zhao-pu"
    P "披蒲编，削竹简" "pi pu bian, xue zhu jian" "古代没有纸书时，有人把蒲草编起来、把竹片削平来写字读书。条件艰苦，却挡不住求学的心。" "无纸也要想办法读书" "hard-study"
    P "彼无书，且知勉" "bi wu shu, qie zhi mian" "那些人没有现成书本，仍然知道勉励自己学习。今天书本和工具更容易得到，更应该珍惜机会。" "条件不足仍要自勉" "hard-study"
)

Insert-AfterVerse "家虽贫，学不辍" @(
    P "如负薪，如挂角" "ru fu xin, ru gua jiao" "朱买臣背柴时还读书，李密把书挂在牛角上边走边读。他们把零碎时间用起来，所以贫苦和忙碌没有拦住学习。" "再忙也能挤时间学习" "hard-study"
    P "身虽劳，犹苦卓" "shen sui lao, you ku zhuo" "身体虽然劳累，他们仍然刻苦努力。学习最怕找借口，真正有志气的人会在困难里坚持。" "劳苦中仍坚持" "hard-study"
)

Insert-AfterVerse "始发愤，读书籍" @(
    P "彼既老，犹悔迟" "bi ji lao, you hui chi" "苏洵年纪不小才开始发愤读书，还后悔自己醒悟得太晚。这个故事提醒孩子，学习越早开始越好。" "晚学会后悔迟" "su-xun"
    P "尔小生，宜早思" "er xiao sheng, yi zao si" "小朋友现在正是学习的好时候，应当早早立志。把今天的时间用好，将来就少一些后悔。" "小学生要早立志" "su-xun"
)

Insert-AfterVerse "对大廷，魁多士" @(
    P "彼既成，众称异" "bi ji cheng, zhong cheng yi" "梁灏年纪很大才考中状元，大家都称奇。成功有早有晚，坚持到底的人才有机会看到结果。" "晚成也值得敬佩" "liang-hao"
    P "尔小生，宜立志" "er xiao sheng, yi li zhi" "孩子看到梁灏的故事，更应该早早立志。目标明确，学习才有方向；方向稳定，努力才不会散。" "从小立志更重要" "liang-hao"
)

Insert-AfterVerse "泌七岁，能赋棋" @(
    P "彼颖悟，人称奇" "bi ying wu, ren cheng qi" "祖莹和李泌都很聪明，才华早早显露。聪明值得称赞，但更重要的是继续学习，不让天资白白浪费。" "聪明还要努力" "young-talents"
    P "尔幼学，当效之" "er you xue, dang xiao zhi" "小朋友学习时，可以效法他们勤读善思。不是每个人都要做神童，但每个人都能每天进步。" "效法勤学的孩子" "young-talents"
)

Insert-AfterVerse "举神童，作正字" @(
    P "彼虽幼，身已仕" "bi sui you, shen yi shi" "刘晏虽然年纪小，却已经因为才学被任用。这个例子说明，真正的能力会让人承担责任。" "年幼有才也能任事" "liuyan-child"
    P "有为者，亦若是" "you wei zhe, yi ruo shi" "有志向、有行动的人，也可以像这些勤学者一样有所作为。关键不是空想，而是从今天开始认真做。" "有志者要行动" "liuyan-child"
)

[System.IO.File]::WriteAllText($dataPath, $source, [System.Text.UTF8Encoding]::new($false))

$count = [regex]::Matches($source, 'verse:\s*"').Count
Write-Host "Completed data.js with $count pages"
