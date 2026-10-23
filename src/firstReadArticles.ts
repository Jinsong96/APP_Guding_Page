import type { CefrLevelKey } from './components/stages/Stage02AiChat';
import type { GoalTrackDetails } from './types';

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export interface FirstReadParagraph {
  text: Record<CefrLevelKey, string>;
  translation: string;
  note: string;
  gist: string;
}

// Key words for the card's interpretation side; only those present in the paragraph text are shown.
export interface FirstReadVocab {
  word: string;
  phonetic?: string;
  meaning: string;
  // Inflected forms to look for in the text (defaults to the word itself).
  forms?: string[];
}

export interface FirstReadArticle {
  id: string;
  title: string;
  chineseTitle: string;
  // Interest themes (as named in the interest picker) this article is recommended for.
  themes: string[];
  minutes: number;
  hook: string;
  coverUrl: string;
  vocab: FirstReadVocab[];
  paragraphs: FirstReadParagraph[];
}

// The first N paragraphs ask for a difficulty rating; the rest are read at the settled level.
export const RATED_PARAGRAPH_COUNT = 4;

export const FIRST_READ_ARTICLES: FirstReadArticle[] = [
  {
    id: 'garden-in-space',
    title: 'A Garden in Space',
    chineseTitle: '太空里的小花园',
    themes: ['科学探索', '世界热点'],
    minutes: 3,
    hook: '在空间站种一棵植物，会发生什么？',
    coverUrl: publicAsset('/assets/story/garden-in-space.jpg'),
    vocab: [
      { word: 'astronaut', phonetic: '/ˈæstrənɔːt/', meaning: 'n. 宇航员', forms: ['astronaut', 'astronauts'] },
      { word: 'orbit', phonetic: '/ˈɔːbɪt/', meaning: 'v./n. 绕轨道运行；轨道', forms: ['orbit', 'orbiting'] },
      { word: 'miss', phonetic: '/mɪs/', meaning: 'v. 想念', forms: ['miss'] },
      { word: 'long for', meaning: '渴望，盼望' },
      { word: 'gravity', phonetic: '/ˈɡrævəti/', meaning: 'n. 重力' },
      { word: 'float', phonetic: '/fləʊt/', meaning: 'v. 漂浮', forms: ['float', 'floats'] },
      { word: 'drift', phonetic: '/drɪft/', meaning: 'v. 漂移，飘荡', forms: ['drift', 'drifts'] },
      { word: 'soil', phonetic: '/sɔɪl/', meaning: 'n. 土壤', forms: ['soil', 'soil-filled'] },
      { word: 'sink', phonetic: '/sɪŋk/', meaning: 'v. 下沉，渗入' },
      { word: 'root', phonetic: '/ruːt/', meaning: 'n. 根', forms: ['root', 'roots'] },
      { word: 'confused', phonetic: '/kənˈfjuːzd/', meaning: 'adj. 困惑的，搞不清的' },
      { word: 'puzzled', phonetic: '/ˈpʌzld/', meaning: 'adj. 困惑的' },
      { word: 'direction', phonetic: '/dəˈrekʃn/', meaning: 'n. 方向', forms: ['direction', 'directions'] },
      { word: 'seed', phonetic: '/siːd/', meaning: 'n. 种子', forms: ['seed', 'seeds'] },
      { word: 'pillow', phonetic: '/ˈpɪləʊ/', meaning: 'n. 枕头；软垫', forms: ['pillow', 'pillows'] },
      { word: 'chamber', phonetic: '/ˈtʃeɪmbə(r)/', meaning: 'n. 舱室，腔室' },
      { word: 'lettuce', phonetic: '/ˈletɪs/', meaning: 'n. 生菜' },
      { word: 'crunchy', phonetic: '/ˈkrʌntʃi/', meaning: 'adj. 脆的' },
      { word: 'crisp', phonetic: '/krɪsp/', meaning: 'adj. 脆的，新鲜的' },
      { word: 'cultivate', phonetic: '/ˈkʌltɪveɪt/', meaning: 'v. 种植，栽培', forms: ['cultivated'] },
      { word: 'zinnia', phonetic: '/ˈzɪniə/', meaning: 'n. 百日菊', forms: ['zinnia', 'zinnias'] },
      { word: 'look after', meaning: '照顾', forms: ['looked after'] },
      { word: 'tend', phonetic: '/tend/', meaning: 'v. 照料', forms: ['tended'] },
      { word: 'gardener', phonetic: '/ˈɡɑːdnə(r)/', meaning: 'n. 园丁' }
    ],
    paragraphs: [
      {
        text: {
          'A1-': 'Astronauts live on a space station. It flies high above the Earth. They work there for many months. They miss green things.',
          'A2': 'Astronauts live on a space station high above the Earth. They often stay for six months, and they start to miss green, living things.',
          'B1': 'Astronauts on the space station often spend six months far above the Earth, and many of them say they begin to miss green, living things.',
          'B2+': 'Astronauts aboard the space station frequently spend half a year orbiting far above the Earth, and many admit they begin to long for anything green and alive.'
        },
        translation: '宇航员住在高悬于地球之上的空间站里。他们常常一待就是六个月，于是开始想念绿色的、有生命的东西。',
        note: 'miss 在这里不是“错过”，而是“想念”。miss green things = 想念绿色的东西。',
        gist: '宇航员长期住在太空，开始想念绿色的生命。'
      },
      {
        text: {
          'A1-': 'So they grow plants. But space has no up and no down. Water does not fall. It floats in little balls.',
          'A2': 'So they try to grow plants. But in space there is no up or down. Water does not fall into the soil. It floats away in small balls.',
          'B1': "So they try to grow plants, but space makes this surprisingly hard. Without gravity, water doesn't sink into the soil; it floats around in tiny drops.",
          'B2+': 'Growing plants up there, however, is surprisingly tricky. Without gravity, water refuses to sink into the soil and instead drifts around in trembling little spheres.'
        },
        translation: '于是他们试着种植物。可太空里没有上下之分，水不会渗进土里，而是变成小水珠飘走。',
        note: 'float 意思是“漂浮”。注意 does not fall 和 floats 的对比：水不往下落，而是飘着。',
        gist: '在太空种植物很难：没有重力，水会飘走。'
      },
      {
        text: {
          'A1-': 'Roots need to know where to go. On Earth, roots grow down. In space, roots are confused. They grow in every way.',
          'A2': "Roots also get confused. On Earth, they always grow down. In space, they don't know which way is down, so they grow in all directions.",
          'B1': "Roots get confused as well. On Earth they always grow downward, but in space they can't tell which way is down, so they spread out in every direction.",
          'B2+': 'The roots are just as puzzled. On Earth they reliably head downward, but in orbit they have no sense of direction and wander off every which way.'
        },
        translation: '根也会迷路。在地球上，根总是往下长；在太空里，它们分不清哪边是下面，只好朝各个方向乱长。',
        note: 'confused = 困惑的、搞不清方向的。把根写得像人一样“迷路”，是一种拟人。',
        gist: '植物的根也分不清方向，只好到处乱长。'
      },
      {
        text: {
          'A1-': 'Scientists made a small garden box. It has soft pads and blue and red lights. The lights help plants grow.',
          'A2': 'Scientists built a small garden box called Veggie. It has soft pillows for the seeds and red and blue lights that act like the sun.',
          'B1': 'To help, scientists built a small garden box called Veggie. The seeds sit in soft pillows of soil, and red and blue lights take the place of sunlight.',
          'B2+': 'To solve this, scientists designed a compact growth chamber called Veggie, in which seeds rest in soft soil-filled pillows while red and blue LEDs stand in for the sun.'
        },
        translation: '为此，科学家造了一个叫 Veggie 的小种植箱：种子躺在装着土的软枕里，红蓝两色的灯代替了阳光。',
        note: 'act like / take the place of 都表示“充当、代替”。lights act like the sun = 灯光充当太阳。',
        gist: '科学家用 Veggie 种植箱和红蓝灯来帮忙。'
      },
      {
        text: {
          'A1-': 'In 2015, the astronauts ate their first space lettuce. They said it tasted fresh and good.',
          'A2': 'In 2015, astronauts ate lettuce they grew in space for the first time. They said it tasted fresh, like a real salad at home.',
          'B1': 'In 2015, astronauts finally tasted lettuce grown in space. They said it was fresh and crunchy, just like a salad back home.',
          'B2+': 'In 2015, the crew finally bit into lettuce cultivated in orbit, describing it as fresh and crisp—remarkably close to a salad back on Earth.'
        },
        translation: '2015 年，宇航员第一次吃到了在太空种出的生菜。他们说它又新鲜又脆，就像家里的沙拉。',
        note: 'for the first time = 第一次。tasted fresh 中 taste 是系动词，后面直接接形容词。',
        gist: '2015 年，宇航员第一次吃到太空种的生菜。'
      },
      {
        text: {
          'A1-': 'Later they grew flowers too. One astronaut took care of them every day. The little garden made the station feel like home.',
          'A2': 'Later they grew flowers too. One astronaut looked after them every day. The small garden made the cold station feel a little more like home.',
          'B1': 'Later they even grew zinnia flowers. One astronaut looked after them like a gardener, and the tiny garden made the station feel more like home.',
          'B2+': 'Before long they were growing zinnias as well. One astronaut tended them like a devoted gardener, and that tiny patch of colour made the station feel far more like home.'
        },
        translation: '后来他们还种出了百日菊。一位宇航员像园丁一样照顾它们，这个小小的花园让空间站更像一个家。',
        note: 'look after = 照顾。feel like home 是常见表达：让人有家的感觉。',
        gist: '后来还种出了花，空间站变得更像家。'
      }
    ]
  },
  {
    id: 'children-world-game',
    title: "A Children's World Game",
    chineseTitle: '纸箱里的小王国',
    themes: ['趣味故事', '自我成长'],
    minutes: 4,
    hook: '一个没有规则的下午，三个孩子能造出什么？',
    coverUrl: publicAsset('/assets/story/hero.webp'),
    vocab: [
      { word: 'stuck', phonetic: '/stʌk/', meaning: 'adj. 被困住的' },
      { word: 'bored', phonetic: '/bɔːd/', meaning: 'adj. 无聊的' },
      { word: 'drizzly', phonetic: '/ˈdrɪzli/', meaning: 'adj. 下毛毛雨的' },
      { word: 'cardboard', phonetic: '/ˈkɑːdbɔːd/', meaning: 'n. 硬纸板' },
      { word: 'battered', phonetic: '/ˈbætəd/', meaning: 'adj. 破旧的' },
      { word: 'drag out', meaning: '拖出来', forms: ['dragged out'] },
      { word: 'haul', phonetic: '/hɔːl/', meaning: 'v. 用力拖', forms: ['hauled'] },
      { word: 'scramble', phonetic: '/ˈskræmbl/', meaning: 'v. 争先恐后地跑', forms: ['scrambled'] },
      { word: 'tower', phonetic: '/ˈtaʊə(r)/', meaning: 'n. 塔', forms: ['towers'] },
      { word: 'square', phonetic: '/skweə(r)/', meaning: 'n. 广场' },
      { word: 'transform', phonetic: '/trænsˈfɔːm/', meaning: 'v. 使彻底改变', forms: ['transformed'] },
      { word: 'crown', phonetic: '/kraʊn/', meaning: 'v. 置于顶端；为…加冕', forms: ['crowned'] },
      { word: 'disagree', phonetic: '/ˌdɪsəˈɡriː/', meaning: 'v. 意见不合', forms: ['disagreed'] },
      { word: 'argue', phonetic: '/ˈɑːɡjuː/', meaning: 'v. 争吵' },
      { word: 'insist on', meaning: '坚持要', forms: ['insisted on'] },
      { word: 'temper', phonetic: '/ˈtempə(r)/', meaning: 'n. 脾气', forms: ['tempers'] },
      { word: 'race track', meaning: '赛车道' },
      { word: 'vote', phonetic: '/vəʊt/', meaning: 'v./n. 投票' },
      { word: 'law', phonetic: '/lɔː/', meaning: 'n. 法律' },
      { word: 'draft', phonetic: '/drɑːft/', meaning: 'v. 起草', forms: ['drafted'] },
      { word: 'kingdom', phonetic: '/ˈkɪŋdəm/', meaning: 'n. 王国' },
      { word: 'let up', meaning: '（雨等）停止，减弱' }
    ],
    paragraphs: [
      {
        text: {
          'A1-': 'It was a rainy afternoon. Three friends sat at home. There was no TV and no games. They were bored.',
          'A2': 'It was a rainy afternoon, and three friends were stuck at home. The TV was broken, and they had nothing to play with.',
          'B1': 'On a rainy afternoon, three friends were stuck indoors. The TV had broken, and there seemed to be nothing at all to do.',
          'B2+': 'One drizzly afternoon, three friends found themselves stuck indoors with a broken television and, as far as they could tell, absolutely nothing to do.'
        },
        translation: '一个下雨的午后，三个好朋友被困在家里。电视坏了，好像什么事都做不了。',
        note: 'stuck at home = 被困在家里。stuck 来自 stick，表示“卡住、动不了”。',
        gist: '下雨天，三个朋友困在家里，无事可做。'
      },
      {
        text: {
          'A1-': 'Then Mia found a big box. "Let\'s make a city," she said. The boys liked the idea.',
          'A2': 'Then Mia found an old cardboard box. "Let\'s build our own city," she said. The two boys smiled and ran to help.',
          'B1': 'Then Mia dragged out an old cardboard box. "Why don\'t we build our own city?" she asked, and the two boys rushed over to help.',
          'B2+': 'Then Mia hauled out a battered cardboard box. "Why don\'t we build a city of our own?" she suggested, and the two boys scrambled over to join in.'
        },
        translation: '这时，米娅拖出一个旧纸箱。“我们自己造一座城市吧！”她说。两个男孩立刻跑过来帮忙。',
        note: "Let's... / Why don't we...? 都是提建议的说法，后者语气更委婉。",
        gist: '米娅找来旧纸箱，提议造一座自己的城市。'
      },
      {
        text: {
          'A1-': "They cut doors and windows. They used old cups for towers. An old clock was the city's big bell.",
          'A2': 'They cut out doors and windows. Old paper cups became towers, and a broken clock became the bell in the city square.',
          'B1': 'They cut out doors and windows, turned paper cups into towers, and made a broken clock the great bell of the city square.',
          'B2+': 'They carved out doors and windows, transformed paper cups into towers, and crowned the city square with a broken clock that served as its great bell.'
        },
        translation: '他们剪出门和窗，把纸杯变成高塔，又让一只坏掉的钟成了城市广场上的大钟。',
        note: 'become / turn A into B 都表示“变成”。turn paper cups into towers = 把纸杯变成塔。',
        gist: '他们用纸杯、坏掉的钟搭出了城市。'
      },
      {
        text: {
          'A1-': 'But they did not agree. Leo wanted a zoo. Sam wanted a race track. They started to shout.',
          'A2': 'But soon they disagreed. Leo wanted a zoo, and Sam wanted a race track. Both of them started to shout.',
          'B1': 'Before long, though, they began to argue. Leo insisted on a zoo, Sam wanted a race track, and soon both of them were shouting.',
          'B2+': 'Before long, however, tempers flared: Leo was determined to have a zoo, Sam would settle for nothing less than a race track, and both were soon shouting.'
        },
        translation: '可没过多久，他们吵了起来：利奥坚持要建动物园，山姆想要赛车道，两人很快都嚷嚷起来。',
        note: 'disagree / argue 都是“意见不合、争吵”。insist on 表示“坚持要”。',
        gist: '两个男孩为建动物园还是赛车道吵了起来。'
      },
      {
        text: {
          'A1-': 'Mia had an idea. "A city needs rules," she said. "Let\'s vote." So they made the first rule together.',
          'A2': 'Mia had an idea. "Every city needs rules," she said. "Let\'s vote." Together, they wrote the very first law of their city.',
          'B1': 'Mia stepped in. "Every city needs rules," she said. "Let\'s vote on it." Together they wrote down the very first law of their little kingdom.',
          'B2+': 'Mia stepped in. "Every city needs rules," she pointed out. "Let\'s put it to a vote." Together they drafted the very first law of their tiny kingdom.'
        },
        translation: '米娅出来调停：“每座城市都需要规则，我们投票吧。”于是他们一起写下了小王国的第一条法律。',
        note: 'vote = 投票。step in 表示“介入、出面调解”。',
        gist: '米娅提议投票，大家定下了第一条法律。'
      },
      {
        text: {
          'A1-': 'The zoo was next to the race track. The animals could watch the cars. When the rain stopped, nobody wanted to go out.',
          'A2': 'In the end, the zoo sat right next to the race track, so the animals could watch the cars. When the rain stopped, no one wanted to leave.',
          'B1': 'In the end, the zoo was built right beside the race track, so the animals could watch the cars. When the rain finally stopped, nobody wanted to go outside.',
          'B2+': 'In the end, the zoo went up right beside the race track, giving the animals front-row seats. By the time the rain let up, nobody had the slightest wish to go outside.'
        },
        translation: '最后，动物园就建在赛车道旁边，动物们可以看赛车。雨停的时候，谁都不想出门了。',
        note: 'In the end = 最后。nobody wanted to... 用否定主语表达“没有人想……”。',
        gist: '动物园建在赛道旁，雨停了也没人想出门。'
      }
    ]
  },
  {
    id: 'five-elements',
    title: 'The Five Elements',
    chineseTitle: '五行里的世界',
    themes: ['文化故事'],
    minutes: 5,
    hook: '古人怎样用五个字解释整个世界？',
    coverUrl: publicAsset('/assets/story/five.webp'),
    vocab: [
      { word: 'element', phonetic: '/ˈelɪmənt/', meaning: 'n. 元素', forms: ['element', 'elements'] },
      { word: 'thinker', phonetic: '/ˈθɪŋkə(r)/', meaning: 'n. 思想家', forms: ['thinkers'] },
      { word: 'observe', phonetic: '/əbˈzɜːv/', meaning: 'v. 观察', forms: ['observed'] },
      { word: 'separate', phonetic: '/ˈseprət/', meaning: 'adj. 分开的，独立的' },
      { word: 'cycle', phonetic: '/ˈsaɪkl/', meaning: 'n. 循环' },
      { word: 'sustain', phonetic: '/səˈsteɪn/', meaning: 'v. 维持，支撑' },
      { word: 'ash', phonetic: '/æʃ/', meaning: 'n. 灰烬' },
      { word: 'metal', phonetic: '/ˈmetl/', meaning: 'n. 金属' },
      { word: 'conceal', phonetic: '/kənˈsiːl/', meaning: 'v. 隐藏', forms: ['conceals'] },
      { word: 'droplet', phonetic: '/ˈdrɒplət/', meaning: 'n. 小水滴', forms: ['droplets'] },
      { word: 'nourish', phonetic: '/ˈnʌrɪʃ/', meaning: 'v. 滋养', forms: ['nourishes'] },
      { word: 'anew', phonetic: '/əˈnjuː/', meaning: 'adv. 重新' },
      { word: 'balance', phonetic: '/ˈbæləns/', meaning: 'n. 平衡' },
      { word: 'put out', meaning: '扑灭', forms: ['puts out'] },
      { word: 'melt', phonetic: '/melt/', meaning: 'v. 熔化', forms: ['melts'] },
      { word: 'extinguish', phonetic: '/ɪkˈstɪŋɡwɪʃ/', meaning: 'v. 熄灭', forms: ['extinguishes'] },
      { word: 'in check', meaning: '受到控制' },
      { word: 'dominate', phonetic: '/ˈdɒmɪneɪt/', meaning: 'v. 支配，占主导' },
      { word: 'season', phonetic: '/ˈsiːzn/', meaning: 'n. 季节' },
      { word: 'be linked to', meaning: '与…相关联', forms: ['linked to'] },
      { word: 'medicine', phonetic: '/ˈmedsn/', meaning: 'n. 医学；药' },
      { word: 'proof', phonetic: '/pruːf/', meaning: 'n. 证明' }
    ],
    paragraphs: [
      {
        text: {
          'A1-': 'Long ago, people in China looked at nature. They saw five things: wood, fire, earth, metal and water.',
          'A2': 'Long ago, people in China watched nature carefully. They believed the world was made of five elements: wood, fire, earth, metal and water.',
          'B1': 'Thousands of years ago, Chinese thinkers studied nature closely and described the world through five elements: wood, fire, earth, metal and water.',
          'B2+': 'Thousands of years ago, Chinese thinkers observed the natural world closely and came to describe it through five elements: wood, fire, earth, metal and water.'
        },
        translation: '很久以前，中国的先人细心观察自然，认为世界由五种元素构成：木、火、土、金、水。',
        note: 'element = 元素。five elements 就是“五行”，英文里常这样翻译。',
        gist: '古人认为世界由木、火、土、金、水五种元素构成。'
      },
      {
        text: {
          'A1-': 'The five things are not alone. They help each other. Wood helps fire. Fire makes earth. It is like a circle.',
          'A2': 'These elements are not separate. They help each other in a circle. Wood feeds fire, and fire leaves ash that becomes earth.',
          'B1': "The elements don't stand alone; they support one another in a cycle. Wood feeds fire, and fire leaves behind ash that turns into earth.",
          'B2+': 'Rather than standing alone, the elements sustain one another in a continuous cycle: wood feeds fire, and fire leaves behind ash that returns to the earth.'
        },
        translation: '这五种元素并不孤立，它们循环相生：木生火，火烧后留下的灰烬又化为土。',
        note: 'in a circle / cycle = 循环。feed 原意“喂养”，这里指“为……提供燃料”。',
        gist: '五行循环相生：木生火，火烧后化为土。'
      },
      {
        text: {
          'A1-': 'Earth has metal inside. Cold metal gets little drops of water. Water helps trees grow. Then the circle starts again.',
          'A2': 'Earth holds metal deep inside. Cold metal collects drops of water, and water helps trees grow. Then the circle begins again.',
          'B1': 'Earth hides metal deep inside it, cool metal gathers drops of water, and water helps trees grow tall. Then the whole cycle begins again.',
          'B2+': 'The earth conceals metal in its depths; cool metal gathers droplets of water; and water nourishes the trees. And so the cycle begins anew.'
        },
        translation: '土中藏着金属，冰凉的金属会凝结水珠，水又滋养树木生长。然后，循环重新开始。',
        note: '注意这一段的结构：A → B → C → 再回到开头，正好对应“土生金、金生水、水生木”。',
        gist: '土生金，金生水，水生木，循环重新开始。'
      },
      {
        text: {
          'A1-': 'They can also stop each other. Water stops fire. Fire makes metal soft. This keeps things in balance.',
          'A2': 'The elements can also control each other. Water puts out fire, and fire melts metal. This keeps everything in balance.',
          'B1': 'The elements can also hold each other back. Water puts out fire, fire melts metal, and in this way nothing grows too strong.',
          'B2+': 'The elements also keep one another in check: water extinguishes fire, fire melts metal, and so no single force is ever allowed to dominate.'
        },
        translation: '五行之间也会相互制约：水灭火，火熔金。这样一来，就没有哪一种力量会过于强大。',
        note: 'put out = 扑灭。in balance = 保持平衡，是理解“相克”的关键。',
        gist: '五行也相互制约，让一切保持平衡。'
      },
      {
        text: {
          'A1-': 'People used the five things for many ideas. Spring is wood. Summer is fire. Each season has an element.',
          'A2': 'People used these ideas everywhere. Each season had an element: spring was wood, summer was fire, and winter was water.',
          'B1': 'People applied these ideas almost everywhere. Each season was linked to an element: spring to wood, summer to fire, and winter to water.',
          'B2+': 'These ideas found their way into almost every corner of life. Each season was paired with an element—spring with wood, summer with fire, winter with water.'
        },
        translation: '人们把这套观念用在了生活的方方面面。每个季节都对应一种元素：春属木，夏属火，冬属水。',
        note: 'be linked to = 与……相关联。spring to wood 是省略句，完整是 spring was linked to wood。',
        gist: '五行被用到生活各处，比如对应四季。'
      },
      {
        text: {
          'A1-': 'Today, many people still talk about the five things. They use them in food, health and art. An old idea is still alive.',
          'A2': 'Today, you can still find the five elements in Chinese food, medicine and art. It is a very old idea, but it is still alive.',
          'B1': 'Today the five elements still appear in Chinese cooking, medicine and art, proving that a very old idea can still feel alive.',
          'B2+': 'Even today, the five elements surface in Chinese cooking, medicine and art—proof that an idea thousands of years old can still feel remarkably alive.'
        },
        translation: '直到今天，五行依然出现在中国的饮食、医学和艺术里——一个古老的想法，至今仍充满生命力。',
        note: 'still alive 这里是比喻：观念“还活着”，即仍然有影响力。',
        gist: '直到今天，五行仍出现在饮食、医学和艺术里。'
      }
    ]
  }
];

// Read from the home page only (not offered in onboarding recommendations).
export const AMAZING_FRIEND_ARTICLE: FirstReadArticle = {
  id: 'amazing-friend',
  title: 'An Amazing Friend',
  chineseTitle: '不可思议的朋友',
  themes: ['自我成长'],
  minutes: 4,
  hook: '一句“早上好”，能改变一个人吗？',
  coverUrl: publicAsset('/assets/story/friend.webp'),
  vocab: [
    { word: 'lonely', phonetic: '/ˈləʊnli/', meaning: 'adj. 孤独的' },
    { word: 'neighbour', phonetic: '/ˈneɪbə(r)/', meaning: 'n. 邻居', forms: ['neighbour', 'neighbours'] },
    { word: 'wave', phonetic: '/weɪv/', meaning: 'v. 挥手', forms: ['wave', 'waved', 'waves'] },
    { word: 'grumpy', phonetic: '/ˈɡrʌmpi/', meaning: 'adj. 脾气坏的，爱发牢骚的' },
    { word: 'ignore', phonetic: '/ɪɡˈnɔː(r)/', meaning: 'v. 不理会', forms: ['ignored'] },
    { word: 'stubborn', phonetic: '/ˈstʌbən/', meaning: 'adj. 固执的' },
    { word: 'persist', phonetic: '/pəˈsɪst/', meaning: 'v. 坚持', forms: ['persisted'] },
    { word: 'garden', phonetic: '/ˈɡɑːdn/', meaning: 'n. 花园', forms: ['garden'] },
    { word: 'repair', phonetic: '/rɪˈpeə(r)/', meaning: 'v. 修理', forms: ['repair', 'repaired'] },
    { word: 'bicycle', phonetic: '/ˈbaɪsɪkl/', meaning: 'n. 自行车' },
    { word: 'patient', phonetic: '/ˈpeɪʃnt/', meaning: 'adj. 耐心的' },
    { word: 'smile', phonetic: '/smaɪl/', meaning: 'v./n. 微笑', forms: ['smile', 'smiled', 'smiling'] },
    { word: 'invite', phonetic: '/ɪnˈvaɪt/', meaning: 'v. 邀请', forms: ['invited'] },
    { word: 'share', phonetic: '/ʃeə(r)/', meaning: 'v. 分享', forms: ['shared'] },
    { word: 'kindness', phonetic: '/ˈkaɪndnəs/', meaning: 'n. 善意' },
    { word: 'change', phonetic: '/tʃeɪndʒ/', meaning: 'v. 改变', forms: ['change', 'changed'] },
    { word: 'friendship', phonetic: '/ˈfrendʃɪp/', meaning: 'n. 友谊' }
  ],
  paragraphs: [
    {
      text: {
        'A1-': 'Mr Hall lived alone on Green Street. He did not talk to anyone. He was old and lonely.',
        'A2': 'Mr Hall lived alone at the end of Green Street. He rarely spoke to his neighbours, and he looked old and lonely.',
        'B1': 'Mr Hall lived alone at the end of Green Street. He hardly ever spoke to his neighbours, and most people thought he was simply grumpy.',
        'B2+': 'Mr Hall lived alone at the far end of Green Street, rarely exchanging a word with his neighbours, who had long since written him off as hopelessly grumpy.'
      },
      translation: '霍尔先生独自住在绿街的尽头。他几乎不和邻居说话，大多数人都觉得他就是脾气不好。',
      note: 'lonely 是“孤独的”，强调心里的感受；alone 只是“独自一人”的状态。',
      gist: '霍尔先生独居，很少和人说话，大家觉得他很孤僻。'
    },
    {
      text: {
        'A1-': 'One day, a girl named Lily moved in next door. Every morning, she waved and said, "Good morning!"',
        'A2': 'One day, a girl named Lily moved in next door. Every morning on her way to school, she waved and said, "Good morning, Mr Hall!"',
        'B1': 'Then a girl named Lily moved in next door. Every morning on her way to school, she waved and called out, "Good morning, Mr Hall!"',
        'B2+': 'Then a girl called Lily moved in next door, and every morning on her way to school she would wave cheerfully and call out, "Good morning, Mr Hall!"'
      },
      translation: '后来，一个叫莉莉的女孩搬到了隔壁。每天早上上学路上，她都会挥手喊一声：“早上好，霍尔先生！”',
      note: 'wave 作动词是“挥手”。every morning 说明这是每天重复的习惯。',
      gist: '新邻居莉莉每天早上都跟他打招呼。'
    },
    {
      text: {
        'A1-': 'Mr Hall did not answer. He looked away. But Lily did not stop. She waved again the next day.',
        'A2': 'At first, Mr Hall ignored her. He just looked away. But Lily did not give up. She waved again the next day, and the next.',
        'B1': 'At first, Mr Hall ignored her completely. But Lily was stubborn in the nicest way, and she kept waving, day after day.',
        'B2+': 'At first he ignored her entirely, but Lily was stubborn in the nicest possible way and persisted, waving at him day after day as if nothing could discourage her.'
      },
      translation: '一开始，霍尔先生完全不理她。可莉莉“倔”得很可爱，一天又一天，她照样向他挥手。',
      note: 'give up = 放弃。day after day 表示“日复一日”，强调坚持。',
      gist: '霍尔先生起初不理她，但莉莉一直没有放弃。'
    },
    {
      text: {
        'A1-': 'One morning, Lily\'s bike was broken. Mr Hall came out. "I can fix that," he said.',
        'A2': 'One morning, Lily\'s bicycle was broken. To her surprise, Mr Hall came out of his house. "I can fix that," he said quietly.',
        'B1': 'One morning, Lily\'s bicycle chain broke outside his gate. To her surprise, Mr Hall came out and said quietly, "I can repair that for you."',
        'B2+': 'One morning Lily\'s bicycle chain snapped right outside his gate, and to her astonishment Mr Hall emerged from the house and offered quietly, "I can repair that for you."'
      },
      translation: '一天早上，莉莉的自行车链条在他家门口断了。让她意外的是，霍尔先生走了出来，轻声说：“我可以帮你修。”',
      note: 'to her surprise = 让她吃惊的是。fix 和 repair 都是“修理”，repair 更正式。',
      gist: '莉莉的自行车坏了，霍尔先生主动出来帮忙修。'
    },
    {
      text: {
        'A1-': 'He fixed the bike in his garden. He smiled for the first time. Lily came back with cookies the next day.',
        'A2': 'He fixed the bike in his garden and even smiled. The next day, Lily came back with cookies, and they talked for an hour.',
        'B1': 'He was patient and careful, and while he worked he even smiled. The next day Lily came back with cookies, and they talked for an hour.',
        'B2+': 'He worked patiently and carefully, and somewhere along the way a smile crept onto his face. The following day Lily returned with cookies, and they ended up talking for an hour.'
      },
      translation: '他耐心细致地修车，修着修着竟然笑了。第二天，莉莉带着饼干回来，他们聊了整整一个小时。',
      note: 'for the first time = 第一次。even 表示“甚至”，突出这个笑容来得不容易。',
      gist: '修车时他笑了，第二天两人聊了很久。'
    },
    {
      text: {
        'A1-': 'Now Mr Hall says hello to everyone. Lily\'s kindness changed his life. Friends can be amazing.',
        'A2': 'Now Mr Hall says hello to everyone on Green Street. One small kindness changed his life. A friend can be truly amazing.',
        'B1': 'Today Mr Hall greets everyone on Green Street and invites children to his garden. One small, stubborn kindness changed his life.',
        'B2+': 'These days Mr Hall greets everyone on Green Street and invites the local children into his garden — proof that a single, stubborn act of kindness can change a life.'
      },
      translation: '如今，霍尔先生会和绿街上的每个人打招呼，还邀请孩子们来他的花园玩。一份小小的、坚持的善意，改变了他的生活。',
      note: 'kindness = 善意。最后一句点题：友谊和善意的力量。',
      gist: '霍尔先生变得开朗，一份坚持的善意改变了他。'
    }
  ]
};

// Key words that actually occur in this version of the paragraph, in reading order.
export const findParagraphVocab = (vocab: FirstReadVocab[], text: string, limit = 4): FirstReadVocab[] => {
  const lower = text.toLowerCase();
  return vocab
    .map((entry) => {
      const positions = (entry.forms || [entry.word])
        .map((form) => lower.search(new RegExp(`(^|[^a-z])${form.toLowerCase()}([^a-z]|$)`)))
        .filter((index) => index !== -1);
      return { entry, position: positions.length ? Math.min(...positions) : -1 };
    })
    .filter((item) => item.position !== -1)
    .sort((a, b) => a.position - b.position)
    .slice(0, limit)
    .map((item) => item.entry);
};

// The goal/exam answer sets where the first read starts; the rated paragraphs refine it from there.
const EXAM_START_LEVELS: Record<string, CefrLevelKey> = {
  'KET/PET': 'A1-',
  中考: 'A1-',
  高考: 'A2',
  四六级: 'A2',
  考研: 'B1',
  雅思或托福: 'B1'
};

export const startLevelForGoal = (goalTrack?: GoalTrackDetails): CefrLevelKey => {
  if (goalTrack?.category === 'exam') return EXAM_START_LEVELS[goalTrack.targetFocus] || 'A2';
  return 'A2';
};

// Words from the paragraphs the user needed help with come first, then words from the rest.
export const collectLearnedWords = (
  article: FirstReadArticle,
  shownLevels: CefrLevelKey[],
  helpedParagraphs: number[],
  limit = 3
): FirstReadVocab[] => {
  const order = [
    ...helpedParagraphs,
    ...article.paragraphs.map((_, index) => index).filter((index) => !helpedParagraphs.includes(index))
  ];
  const words: FirstReadVocab[] = [];
  for (const index of order) {
    const level = shownLevels[index];
    if (!level) continue;
    for (const entry of findParagraphVocab(article.vocab, article.paragraphs[index].text[level], 10)) {
      if (!words.some((word) => word.word === entry.word)) words.push(entry);
      if (words.length >= limit) return words;
    }
  }
  return words;
};

// Home-page story cards (data.ts WORLD_STORIES) open these articles in the same reader as the first read.
export const HOME_STORY_ARTICLES: Record<string, FirstReadArticle> = {
  'world-1': FIRST_READ_ARTICLES.find((article) => article.id === 'children-world-game')!,
  'world-2': AMAZING_FRIEND_ARTICLE,
  'world-3': FIRST_READ_ARTICLES.find((article) => article.id === 'five-elements')!
};

// Articles matching the user's interests come first, in the order the interests were picked.
export const rankArticlesForInterests = (interests: string[] = []): FirstReadArticle[] => {
  const rank = (article: FirstReadArticle) => {
    const hits = interests.map((interest) => article.themes.indexOf(interest) !== -1);
    const first = hits.indexOf(true);
    return first === -1 ? interests.length : first;
  };
  return [...FIRST_READ_ARTICLES].sort((a, b) => rank(a) - rank(b));
};
