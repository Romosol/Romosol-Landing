import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  Box, 
  Compass, 
  Mail, 
  Github, 
  ExternalLink, 
  Copy, 
  Check, 
  Radio, 
  Gamepad2, 
  Globe, 
  Sparkles, 
  X, 
  Terminal, 
  Code2, 
  ArrowUpRight,
  Download,
  Search,
  Wrench,
  Layers,
  Ruler,
  CheckCircle,
  Volume2
} from 'lucide-react';
import { ThreeModelViewer, ModelData } from './components/ThreeModelViewer';

type NavSection = 'projects' | 'models' | 'links';

interface Project {
  id: string;
  title: string;
  repoName: string;
  tagline: string;
  category: string;
  year: string;
  stack: string[];
  description: string;
  features: string[];
  role: string;
  githubUrl: string;
  highlight?: string;
}

interface CuratedLink {
  id: string;
  title: string;
  subtitle: string;
  category: 'games' | 'interactive' | 'media' | 'tech';
  url: string;
  description: string;
  badge: string;
}

const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${path.replace(/^\/+/, '')}`;
};

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('projects');
  
  // Projects state — real GitHub repositories of Romosol
  const [selectedProjectId, setSelectedProjectId] = useState<string>('navigator-rest');

  // 3D Models state — 24 real STL files from the user
  const [selectedModelId, setSelectedModelId] = useState<string>('auto-shelf');
  const [activeModelCategory, setActiveModelCategory] = useState<string>('all');
  const [modelSearchQuery, setModelSearchQuery] = useState<string>('');
  
  // Links state
  const [activeLinkCategory, setActiveLinkCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRiddle, setShowRiddle] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [showRiddleResponse, setShowRiddleResponse] = useState(false);
  const [lastUmaTriggered, setLastUmaTriggered] = useState(false);

  const handleRiddleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = riddleAnswer.toLowerCase().trim();
    if (clean.includes('ума') || clean.includes('uma')) {
      setShowRiddleResponse(true);
      setLastUmaTriggered(false);
    } else {
      setLastUmaTriggered(true);
      setTimeout(() => setLastUmaTriggered(false), 2000);
      try {
        const audio = new Audio(getAssetUrl('uma_voice.mp3'));
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.warn('Audio error:', err);
        });
      } catch (err) {
        console.warn('Audio error:', err);
      }
    }
  };

  // Utility states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('romosol2012@yandex.ru');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const projects: Project[] = [
    {
      id: 'navigator-rest',
      title: 'Navigator Tools (REST API)',
      repoName: 'Navigator-Tools-REST-API-',
      tagline: 'Автоматизация рутинных задач на портале Навигатор ДО через REST API',
      category: 'Python / REST API',
      year: '2026',
      stack: ['Python', 'REST API', 'Requests', 'OpenPyXL'],
      description: 'Высокопроизводительный инструмент автоматизации взаимодействия с региональной АИС «Навигатор дополнительного образования». Заменяет медленный ручной ввод данных через веб-интерфейс на пакетную фоновую обработку через прямые HTTPS REST API запросы.',
      features: [
        'Работает с большими списками из Excel',
        'Реализовано много функций для удобной работы',
        'Стабильная работа',
        'Система проверки свежих версий',
        'Постоянно улучшается'
      ],
      role: 'Автор проекта, реверс-инжиниринг API, разработка GUI и интеграция с Excel',
      githubUrl: 'https://github.com/Romosol/Navigator-Tools-REST-API-',
      highlight: 'v2.1 &bull; REST API'
    },
    {
      id: 'digital-logbook',
      title: 'Digital LogBook',
      repoName: 'Digital-LogBook-for-GBU-DO-RDOT',
      tagline: 'Цифровой журнал взамен бумажного варианта для учёта деятельности ПДО',
      category: 'Desktop & Automation',
      year: '2025–2026',
      stack: ['Python', 'Data Processing', 'Automation', 'Excel/Reports'],
      description: 'Специализированная программа электронного журнала, разработанная для преподавателей и педагогов дополнительного образования (ПДО) ГБУ ДО РДОТ в качестве удобной и быстрой альтернативы традиционному бумажному журналу.',
      features: [
        'Электронный учет учебных групп, списков учащихся и посещаемости занятий',
        'Ведение календарно-тематических планов и программ дополнительного образования',
        'Устранение рутинных ошибок и автоматическое формирование сводных ведомостей и отчетности',
        'Удобная структура, полностью соответствующая регламентам образовательного учреждения'
      ],
      role: 'Архитектура приложения, разработка логики учета и структуры хранения данных',
      githubUrl: 'https://github.com/Romosol/Digital-LogBook-for-GBU-DO-RDOT',
      highlight: 'ГБУ ДО РДОТ'
    },
    {
      id: 'navigator-selenium',
      title: 'Navigator Tools (Selenium)',
      repoName: 'Navigator-Tools-selenium',
      tagline: 'Комплекс браузерной автоматизации для сайта «Навигатор ДО» на Selenium',
      category: 'RPA & Web Scraping',
      year: '2026',
      stack: ['Python', 'Selenium WebDriver', 'Headless Chrome', 'DOM Automation'],
      description: 'Инструмент для автоматического выполнения действий в веб-интерфейсе «Навигатора дополнительного образования» с использованием Selenium WebDriver. Предназначен для сценариев, требующих полноценной эмуляции поведения пользователя в браузере.',
      features: [
        'Автоматизированное прохождение сценариев авторизации и навигации по порталу',
        'Обработка динамических элементов веб-страниц, AJAX-запросов и явных ожиданий (explicit waits)',
        'Эмуляция пользовательских действий для обхода ограничений стандартных форм ввода',
        'Снижение нагрузки на операторов при заполнении объемных заявок'
      ],
      role: 'Разработка скриптов автоматизации и обработчиков веб-страниц',
      githubUrl: 'https://github.com/Romosol/Navigator-Tools-selenium',
      highlight: 'Selenium RPA'
    }
  ];

  // 24 Real STL models created by the user
  const models: ModelData[] = [
    {
      id: 'speaker-case',
      name: 'Корпус для динамика',
      fileName: 'Корпус для динамика.stl',
      fileUrl: '/models/korpus_dlya_dinamika.stl',
      category: 'engineering',
      categoryLabel: 'Акустика',
      polygons: '228.6k граней',
      dimensions: '240 × 60 × 206 мм',
      software: 'CAD / 3D-печать',
      description: 'Обновленный и переработанный корпус для динамика, оптимизированный под аддитивное производство и точную установку акустических компонентов.',
      color: '#38bdf8'
    },
    {
      id: 'auto-shelf',
      name: 'Полка вместо пепельницы в авто',
      fileName: 'Полка вместо пепельницы в машину.stl',
      fileUrl: '/models/polka_vmesto_pepelnitsy.stl',
      category: 'auto',
      categoryLabel: 'Авто',
      polygons: '55.4k граней',
      dimensions: '196 × 148 × 75 мм',
      software: 'CAD / 3D-печать',
      description: 'Эргономичная ниша-полка для смартфона и аксессуаров, устанавливаемая взамен штатной пепельницы в центральную консоль автомобиля.',
      color: '#f59e0b'
    },
    {
      id: 'auto-handle',
      name: 'Ручка над дверью в салон авто',
      fileName: 'Ручка над дверью в машину.stl',
      fileUrl: '/models/ruchka_nad_dveryu_mashiny.stl',
      category: 'auto',
      categoryLabel: 'Авто',
      polygons: '263.0k граней',
      dimensions: '185 × 149 × 78 мм',
      software: 'CAD / Прочность',
      description: 'Потолочный поручень салона автомобиля с анатомическим хватом и усиленными посадочными отверстиями под крепежные винты.',
      color: '#3b82f6'
    },
    {
      id: 'auto-foglights',
      name: 'Крепления для противотуманных фар (ПТФ)',
      fileName: 'Крепления для туманок.stl',
      fileUrl: '/models/krepleniya_tumanok.stl',
      category: 'auto',
      categoryLabel: 'Автосвет',
      polygons: '77.2k граней',
      dimensions: '236 × 235 × 40 мм',
      software: 'Инженерный CAD',
      description: 'Монтажные кронштейны для надежной установки и точной юстировки противотуманных фар в передний бампер автомобиля.',
      color: '#eab308'
    },
    {
      id: 'auto-button',
      name: 'Кнопка приборной панели авто',
      fileName: 'Кнопка в машине.stl',
      fileUrl: '/models/knopka_v_mashine.stl',
      category: 'auto',
      categoryLabel: 'Интерьер авто',
      polygons: '52.2k граней',
      dimensions: '45 × 53 × 32 мм',
      software: 'Параметрический CAD',
      description: 'Сменная клавиша управления в приборную панель автомобиля с точными направляющими и фиксаторами взамен изношенной штатной.',
      color: '#06b6d4'
    },
    {
      id: 'auto-caps',
      name: 'Комплект технологических заглушек в авто',
      fileName: 'Заглушки для машины.stl',
      fileUrl: '/models/zaglushki_dlya_mashiny.stl',
      category: 'auto',
      categoryLabel: 'Авто',
      polygons: '57.7k граней',
      dimensions: '128 × 114 × 26 мм',
      software: 'CAD / Защелки',
      description: 'Заглушки с эластичными клипсами-защелками для скрытия монтажных и технологических отверстий кузова и обшивки авто.',
      color: '#64748b'
    },
    {
      id: 'grinder',
      name: 'Кожух пылеудаления для болгарки',
      fileName: 'Grinder Dust Shroud.stl',
      fileUrl: '/models/grinder_dust_shroud.stl',
      category: 'tools',
      categoryLabel: 'Оснастка',
      polygons: '36.5k граней',
      dimensions: '155 × 64 × 138 мм',
      software: 'Инженерный CAD',
      description: 'Защитный кожух пылеудаления для углошлифовальной машины (болгарки) с патрубком для подключения строительного пылесоса.',
      color: '#f97316'
    },
    {
      id: 'dryer-parts',
      name: 'Детали для сушилки филамента',
      fileName: 'Детали для сушилки филамента.stl',
      fileUrl: '/models/detali_sushilki_filamenta.stl',
      category: 'tools',
      categoryLabel: '3D-печать',
      polygons: '7.8k граней',
      dimensions: '107 × 149 × 28 мм',
      software: 'CAD / 3D-печать',
      description: 'Специализированные направляющие и опоры для модернизации камеры сушки катушек филамента 3D-принтера.',
      color: '#10b981'
    },
    {
      id: 'battery-holders',
      name: 'Батарейные отсеки под металлические контакты',
      fileName: 'Батарейные отсеки под вставку металлических контактов.stl',
      fileUrl: '/models/batareynye_otseki.stl',
      category: 'tools',
      categoryLabel: 'Электроника',
      polygons: '37.8k граней',
      dimensions: '70 × 73 × 19 мм',
      software: 'CAD / Прототипирование',
      description: 'Модульный отсек для аккумуляторов и батарей со специальными посадочными пазами для быстрой установки пружинных металлических лепестков.',
      color: '#ec4899'
    },
    {
      id: 'screwdriver-cap',
      name: 'Вращающийся торец (пимпочка) отвертки',
      fileName: 'пимпочка отвёртки.stl',
      fileUrl: '/models/pimpochka_otvertki.stl',
      category: 'tools',
      categoryLabel: 'Инструмент',
      polygons: '32.4k граней',
      dimensions: '24 × 10 × 24 мм',
      software: 'CAD / Реверс-инжиниринг',
      description: 'Сменная вращающаяся упорная пятка под ладонь для часовой и прецизионной отвертки с точной осевой фиксацией.',
      color: '#14b8a6'
    },
    {
      id: 'ruchka',
      name: 'Эргономичная ручка лопаты',
      fileName: 'Ручка лопаты.stl',
      fileUrl: '/models/ruchka_lopaty.stl',
      category: 'tools',
      categoryLabel: 'Инструмент',
      polygons: '32.8k граней',
      dimensions: '75 × 37 × 92 мм',
      software: 'CAD / Эргономика',
      description: 'Прочная Т-образная рукоятка под стандартный черенок лопаты с анатомическим хватом и ребрами жесткости.',
      color: '#84cc16'
    },
    {
      id: 'duika',
      name: 'Сопло-конус для обдува v3',
      fileName: 'Дуйка конус_3.stl',
      fileUrl: '/models/duika_konus_3.stl',
      category: 'tools',
      categoryLabel: 'Оснастка',
      polygons: '32.8k граней',
      dimensions: '81 × 81 × 135 мм',
      software: 'Инженерный CAD',
      description: 'Коническая насадка-сопло для направленного обдува воздухом с оптимизированным профилем внутреннего сечения.',
      color: '#d946ef'
    },
    {
      id: 'toothbrush-organizer',
      name: 'Органайзер для зубной пасты и щеток',
      fileName: 'Органайзер для зубной пасты и щётки.stl',
      fileUrl: '/models/organizer_zubnaya_pasta_schetka.stl',
      category: 'home',
      categoryLabel: 'Быт',
      polygons: '239.6k граней',
      dimensions: '149 × 207 × 37 мм',
      software: 'CAD / Быт',
      description: 'Эргономичная настольная подставка с индивидуальными ячейками под зубные щетки, тюбик пасты и дренажными вентиляционными каналами.',
      color: '#8b5cf6'
    },
    {
      id: 'v-vannuyu',
      name: 'Органайзер в ванную',
      fileName: 'В ванную.stl',
      fileUrl: '/models/v_vannuyu.stl',
      category: 'home',
      categoryLabel: 'Быт',
      polygons: '22.3k граней',
      dimensions: '144 × 88 × 530 мм',
      software: 'Параметрический CAD',
      description: 'Функциональный подвесной органайзер для ванной комнаты со слотами для гигиенических принадлежностей и дренажом.',
      color: '#6366f1'
    },
    {
      id: 'tabletochnica',
      name: 'Органайзер-таблетница',
      fileName: 'Таблеточница.stl',
      fileUrl: '/models/tabletochnica.stl',
      category: 'home',
      categoryLabel: 'Органайзеры',
      polygons: '58.9k граней',
      dimensions: '76 × 46 × 160 мм',
      software: 'CAD / Быт',
      description: 'Обновленная версия многосекционного органайзера для таблеток с крышкой и разделителями по дням/приемам.',
      color: '#06b6d4'
    },
    {
      id: 'closet-mount',
      name: 'Крепление поперечной перекладины на шкаф',
      fileName: 'Крепление поперечной перекладины на шкаф.stl',
      fileUrl: '/models/kreplenie_perekladiny_shkaf.stl',
      category: 'home',
      categoryLabel: 'Мебель',
      polygons: '18.3k граней',
      dimensions: '63 × 30 × 23 мм',
      software: 'CAD / Мебельная фурнитура',
      description: 'Усиленный боковой держатель-фланец для жесткой фиксации поперечной штанги под плечики в гардеробном шкафу.',
      color: '#a855f7'
    },
    {
      id: 'ramka',
      name: 'Декоративная рамка v2',
      fileName: 'Рамка_2.stl',
      fileUrl: '/models/ramka_2.stl',
      category: 'home',
      categoryLabel: 'Декор',
      polygons: '16.9k граней',
      dimensions: '194 × 204 × 16 мм',
      software: 'CAD / Дизайн',
      description: 'Тонкая рамка с внутренним пазом под фотографию или электронную панель дисплея.',
      color: '#c084fc'
    },
    {
      id: 'ognetushitel',
      name: 'Крепление огнетушителя',
      fileName: 'Крепление огнетушителя.stl',
      fileUrl: '/models/kreplenie_ognetushitelya.stl',
      category: 'home',
      categoryLabel: 'Безопасность',
      polygons: '2.2k граней',
      dimensions: '177 × 269 × 50 мм',
      software: 'CAD / Крепеж',
      description: 'Надежный настенный кронштейн для фиксации автомобильного или бытового огнетушителя с быстросъемным замком.',
      color: '#ef4444'
    },
    {
      id: 'plaphon',
      name: 'Плафон 2.2',
      fileName: 'plaphon_2_2.stl',
      fileUrl: '/models/plaphon_2_2.stl',
      category: 'engineering',
      categoryLabel: 'Освещение',
      polygons: '14.4k граней',
      dimensions: '149 × 149 × 62 мм',
      software: 'CAD / Дизайн',
      description: 'Геометрический плафон для светильника с радиальными ребрами рассеивания света и посадочным пазом под патрон.',
      color: '#10b981'
    },
    {
      id: 'old-lamp-shade',
      name: 'Плафон на старую лампу',
      fileName: 'Плафон на старую лампу.stl',
      fileUrl: '/models/plafon_staraya_lampa.stl',
      category: 'engineering',
      categoryLabel: 'Освещение',
      polygons: '1.8k граней',
      dimensions: '150 × 150 × 63 мм',
      software: 'CAD / Реставрация',
      description: 'Восстановленный по оригинальным размерам конусообразный абажур-рассеиватель для ремонта винтажной настольной лампы.',
      color: '#f43f5e'
    },
    {
      id: 'nasadka-v2',
      name: 'Насадка на трубу 110 (Final v2)',
      fileName: 'насадка на трубу 110 final v2.stl',
      fileUrl: '/models/nasadka_110_final_v2.stl',
      category: 'engineering',
      categoryLabel: 'Вентиляция',
      polygons: '105.3k граней',
      dimensions: '140 × 181 × 154 мм',
      software: 'Параметрический CAD',
      description: 'Вторая версия насадки на 110-ю трубу с усиленным фланцем, дефлектором и улучшенной аэродинамикой.',
      color: '#f97316'
    },
    {
      id: 'nasadka-v1',
      name: 'Насадка на трубу 110 (Final v1)',
      fileName: 'насадка на трубу 110 final.stl',
      fileUrl: '/models/nasadka_110_final.stl',
      category: 'engineering',
      categoryLabel: 'Вентиляция',
      polygons: '58.5k граней',
      dimensions: '140 × 140 × 124 мм',
      software: 'Параметрический CAD',
      description: 'Базовая версия монтажного переходника на трубу диаметром 110 мм с фланцем и ребрами жесткости.',
      color: '#eab308'
    },
    {
      id: 'filtr',
      name: 'Корпус воздушного фильтра в сборе',
      fileName: 'Фильтр сборка.stl',
      fileUrl: '/models/filtr_sborka.stl',
      category: 'engineering',
      categoryLabel: 'Вентиляция',
      polygons: '27.1k граней',
      dimensions: '275 × 152 × 191 мм',
      software: 'Сборочный CAD',
      description: 'Сборный корпус воздушного фильтра с посадочным фланцем, направляющими воздушного потока и отсеком под фильтрующий элемент.',
      color: '#14b8a6'
    },
    {
      id: 'zaglushka',
      name: 'Заглушка технологическая (в гараж)',
      fileName: 'заглушка в гараж.stl',
      fileUrl: '/models/zaglushka_garazh.stl',
      category: 'engineering',
      categoryLabel: 'Фитинги',
      polygons: '11.2k граней',
      dimensions: '100 × 22 × 100 мм',
      software: 'CAD / Фитинги',
      description: 'Герметичная цилиндрическая заглушка с упорным бортиком для защиты технологических отверстий и труб от пыли и мусора.',
      color: '#64748b'
    }
  ];

  // 20 curated interesting links provided by the user
  const links: CuratedLink[] = [
    {
      id: 'quickdraw',
      title: 'Quick, Draw! (Google)',
      subtitle: 'quickdraw.withgoogle.com',
      category: 'interactive',
      url: 'https://quickdraw.withgoogle.com/#',
      description: 'Нейросеть Google пытается угадать, что вы рисуете за 20 секунд. Крупнейший открытый датасет каракулей в мире.',
      badge: 'ИИ & Скетчи'
    },
    {
      id: 'humanclock',
      title: 'The Human Clock',
      subtitle: 'humanclock.com',
      category: 'interactive',
      url: 'https://www.humanclock.com/',
      description: 'Часы реального времени, где каждая минута отображается уникальной фотографией людей с табличками времени со всего мира.',
      badge: 'Фото-часы'
    },
    {
      id: 'radio',
      title: 'Сирийское радио',
      subtitle: 'radio.garden • Эль-Камышлы',
      category: 'media',
      url: 'https://radio.garden/visit/qamishli/ICuZh1EK',
      description: 'Живой эфир радиостанций через интерактивный трехмерный земной шар Radio Garden. Аутентичная музыка и атмосфера.',
      badge: 'Радио'
    },
    {
      id: 'mrim',
      title: 'MRIM (Mail.Ru Агент)',
      subtitle: 'mrim.su',
      category: 'media',
      url: 'https://mrim.su/',
      description: 'Веб-клиент классического протокола Mail.Ru Агента — ностальгия по эпохе нулевых, контактам и легендарным смайликам.',
      badge: 'Ностальгия'
    },
    {
      id: 'projectnomad',
      title: 'Project Nomad',
      subtitle: 'projectnomad.us/install',
      category: 'tech',
      url: 'https://www.projectnomad.us/install',
      description: 'Портативная автономная система для создания локальных серверов с базами знаний, картами и софтом для чрезвычайных ситуаций.',
      badge: 'Оффлайн-сервер'
    },
    {
      id: 'bumpmesh',
      title: 'Bumpmesh Platform',
      subtitle: 'bumpmesh.com',
      category: 'tech',
      url: 'https://bumpmesh.com/',
      description: 'Проект в сфере трехмерной графики, полигональных мешей и инструментов генерации 3D-геометрии в вебе.',
      badge: '3D Mesh'
    },
    {
      id: 'dialed',
      title: 'Dialed.gg',
      subtitle: 'dialed.gg',
      category: 'games',
      url: 'https://dialed.gg/',
      description: 'Игры на память.',
      badge: 'Гейминг'
    },
    {
      id: 'mythconceptions',
      title: 'Common Mythconceptions',
      subtitle: 'informationisbeautiful.net',
      category: 'interactive',
      url: 'https://informationisbeautiful.net/visualizations/common-mythconceptions/',
      description: 'Интерактивная визуализация от Information is Beautiful с проверкой самых живучих заблуждений и мифов человечества.',
      badge: 'Инфографика'
    },
    {
      id: 'classicgamezone',
      title: 'Classic Game Zone',
      subtitle: 'classicgamezone.com',
      category: 'games',
      url: 'https://classicgamezone.com/',
      description: 'Большая онлайн-библиотека культовых ретро-игр с консолей и DOS, доступных для запуска прямо в веб-браузере.',
      badge: 'Ретро-игры'
    },
    {
      id: 'boardgamearena',
      title: 'Board Game Arena',
      subtitle: 'ru.boardgamearena.com',
      category: 'games',
      url: 'https://ru.boardgamearena.com/',
      description: 'Крупнейший в мире портал для игры в лицензионные настольные игры онлайн в реальном времени или пошагово с друзьями.',
      badge: 'Настолки'
    },
    {
      id: 'memedepot',
      title: 'Meme Depot',
      subtitle: 'memedepot.com',
      category: 'interactive',
      url: 'https://memedepot.com/',
      description: 'Открытый онлайн-каталог и хранилище интернет-мемов, вирусных шаблонов и графических коллекций.',
      badge: 'Мемы'
    },
    {
      id: 'edem',
      title: 'Edem',
      subtitle: 'edem.cc',
      category: 'media',
      url: 'https://edem.cc/',
      description: 'Куда и как можно попасть.',
      badge: 'Интерактив'
    },
    {
      id: 'trafficvision',
      title: 'Traffic Vision Live',
      subtitle: 'trafficvision.live',
      category: 'interactive',
      url: 'https://trafficvision.live/',
      description: 'Интерактивная карта и видеопотоки с дорожных камер наблюдения за трафиком в режиме реального времени.',
      badge: 'Live Камеры'
    },
    {
      id: 'choicervoicer',
      title: 'Choice & Voice Games',
      subtitle: 'choicervoicer.games',
      category: 'games',
      url: 'https://choicervoicer.games/',
      description: 'Игра, где нужно имитировать голос.',
      badge: 'Интерактив'
    },
    {
      id: 'my9games',
      title: 'My9Games',
      subtitle: 'my9games.net/en',
      category: 'media',
      url: 'https://my9games.net/en',
      description: 'Расскажи о своих лбимых играх и аниме.',
      badge: 'Игры'
    },
    {
      id: 'reinachan',
      title: 'Reina-chan (Itch.io)',
      subtitle: 'amaryllis-works.itch.io',
      category: 'games',
      url: 'https://amaryllis-works.itch.io/reina-chan',
      description: 'Инди-игра от студии Amaryllis Works на платформе itch.io с характерной авторской стилистикой.',
      badge: 'Инди'
    },
    {
      id: 'slothmon',
      title: 'SlothMon',
      subtitle: 'kuuhugu.github.io/SlothMon',
      category: 'tech',
      url: 'https://kuuhugu.github.io/SlothMon/',
      description: 'Сделай смартфон вторым монитором.',
      badge: 'Технологии'
    },
    {
      id: 'anythingrip',
      title: 'Anything.rip',
      subtitle: 'anything.rip',
      category: 'media',
      url: 'https://anything.rip/',
      description: 'Минималистичный онлайн-инструмент для конвертации, обработки и быстрого извлечения аудио/медиа файлов.',
      badge: 'Утилита'
    },
    {
      id: 'zerohour',
      title: 'Zero Hour Tactical',
      subtitle: 'zerohour.gg',
      category: 'games',
      url: 'https://zerohour.gg/',
      description: 'Официальный портал стратегии Zero Hour.',
      badge: 'Тактический шутер'
    },
    {
      id: 'fujitsu',
      title: 'Fujitsu-Siemens ESPRIMO V5515',
      subtitle: 'usnotebook.ru',
      category: 'tech',
      url: 'https://usnotebook.ru/obzor-otzivi-Fujitsu-Siemens-ESPRIMO-Mobile-V5515/',
      description: 'Подробный ностальгический технический обзор и отзывы о классическом ноутбуке Fujitsu Siemens ESPRIMO Mobile V5515.',
      badge: 'Ретро-железо'
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const currentModel = models.find(m => m.id === selectedModelId) || models[0];

  // Filtering 3D models by category and search
  const filteredModels = useMemo(() => {
    return models.filter(item => {
      const matchesCategory = activeModelCategory === 'all' || item.category === activeModelCategory;
      const q = modelSearchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        item.fileName.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeModelCategory, modelSearchQuery, models]);

  // Filtering links by category and search text
  const filteredLinks = useMemo(() => {
    return links.filter(item => {
      const matchesCategory = activeLinkCategory === 'all' || item.category === activeLinkCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) || 
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeLinkCategory, searchQuery, links]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased font-sans selection:bg-neutral-800 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-12">
        {/* =========================================================================
            БЛОК 1: КРАТКАЯ ИНФОРМАЦИЯ ОБО МНЕ С ВЕРТИКАЛЬНОЙ ФОТОГРАФИЕЙ
           ========================================================================= */}
        <section className="border border-neutral-800 bg-neutral-900/40 rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10">
            
            {/* Вертикальная фотография */}
            <div className="shrink-0">
              <div className="relative group w-44 sm:w-52 aspect-[3/4] rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 shadow-2xl transition-all duration-300 hover:border-neutral-500">
                <img
                  src={getAssetUrl('fish.jpg')}
                  alt="фото с рыбой (не ии)"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
              </div>
            </div>

            {/* Текстовая информация */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono tracking-wider uppercase text-neutral-400">
                  Автоматизация &bull; 3D Моделирование и печать &bull; Прототипирование
                </span>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                  Роман Солодовников
                </h1>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl font-normal">
                Разрабатываю инструменты автоматизации рутинных процессов (Python, REST API, Selenium) и инженерные 3D-модели под печать.
              </p>

              {/* Цитата из репозитория */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
                  <span className="text-neutral-500 font-mono">Девиз:</span>
                  <span className="text-neutral-200 italic font-mono text-[13px]">
                    «Report to the ship as soon as possible… we'll bang, ok?»
                  </span>
                </div>
              </div>

              {/* Кнопки контактов и действий */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-neutral-950 font-medium text-xs hover:bg-neutral-200 active:scale-95 transition cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Почта скопирована' : 'romosol2012@yandex.ru'}</span>
                </button>

                <a
                  href="mailto:romosol2012@yandex.ru"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Написать</span>
                </a>

                <a
                  href="https://github.com/Romosol"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowRiddle(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Загадка</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            БЛОК 2: МИНИМАЛИСТИЧНАЯ НАВИГАЦИЯ
            (Мои проекты / Мои 3D модели / Интересные ссылки)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="flex border-b border-neutral-800 pb-2">
            <nav className="flex items-center gap-1 sm:gap-2" aria-label="Разделы портфолио">
              <button
                type="button"
                onClick={() => setActiveSection('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeSection === 'projects'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Мои проекты</span>
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                  {projects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('models')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeSection === 'models'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>Мои 3D модели</span>
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                  {models.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('links')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeSection === 'links'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Интересные ссылки</span>
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                  {links.length}
                </span>
              </button>
            </nav>
          </div>

          {/* =========================================================================
              РАЗДЕЛ: МОИ ПРОЕКТЫ (3 РЕПОЗИТОРИЯ С GITHUB)
             ========================================================================= */}
          {activeSection === 'projects' && (
            <div className="space-y-6">

              {/* Список 3 реальных проектов */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map((project) => {
                  const isSelected = project.id === selectedProjectId;
                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-neutral-900/90 border-neutral-600 shadow-md ring-1 ring-neutral-600'
                          : 'bg-neutral-900/25 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                            {project.category}
                          </span>
                          {project.highlight && (
                            <span 
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                              dangerouslySetInnerHTML={{ __html: project.highlight }}
                            />
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                            <span>{project.title}</span>
                            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                          </h3>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                            {project.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 3).map((tech) => (
                          <span 
                            key={tech} 
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Детальный просмотрщик выбранного проекта */}
              <div className="border border-neutral-800 bg-neutral-900/30 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wide">
                        Обзор репозитория
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-emerald-400">
                        {currentProject.repoName}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                      {currentProject.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Открыть на GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
                        Описание проекта
                      </h4>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {currentProject.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                        Ключевые возможности
                      </h4>
                      <ul className="space-y-2">
                        {currentProject.features.map((feat, index) => (
                          <li key={index} className="text-xs text-neutral-300 flex items-start gap-2">
                            <span className="text-emerald-500 font-mono mt-0.5">&bull;</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-[11px] font-mono text-neutral-500 uppercase block">Моя роль</span>
                      <span className="text-xs text-neutral-200 font-medium">{currentProject.role}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-neutral-500 uppercase block">Категория</span>
                      <span className="text-xs text-neutral-200 font-medium">{currentProject.category}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-neutral-500 uppercase block mb-1.5">Технологии и стек</span>
                      <div className="flex flex-wrap gap-1">
                        {currentProject.stack.map(s => (
                          <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              РАЗДЕЛ: МОИ 3D МОДЕЛИ (13 РЕАЛЬНЫХ STL ФАЙЛОВ)
             ========================================================================= */}
          {activeSection === 'models' && (
            <div className="space-y-6">
              {/* Верхняя панель фильтров и поиска моделей */}
              <div className="space-y-4 border-b border-neutral-800 pb-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Поиск */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      placeholder="Поиск по 3D моделям..."
                      className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                    />
                    {modelSearchQuery && (
                      <button
                        onClick={() => setModelSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Счетчик */}
                  <div className="text-xs font-mono text-neutral-400 self-end sm:self-center">
                    Каталог: <span className="text-emerald-400 font-semibold">{filteredModels.length}</span> из {models.length} моделей
                  </div>
                </div>

                {/* Категории 3D моделей */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'Все модели', count: models.length },
                    { id: 'auto', label: 'Авто & Тюнинг', count: models.filter(m => m.category === 'auto').length },
                    { id: 'tools', label: 'Оснастка & Инструмент', count: models.filter(m => m.category === 'tools').length },
                    { id: 'home', label: 'Быт & Органайзеры', count: models.filter(m => m.category === 'home').length },
                    { id: 'engineering', label: 'Инженерия & Вент.', count: models.filter(m => m.category === 'engineering').length },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveModelCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        activeModelCategory === cat.id
                          ? 'bg-neutral-800 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Селектор моделей (сетка карточек) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {filteredModels.map((model) => {
                  const isSelected = model.id === selectedModelId;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModelId(model.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800 border-neutral-600 shadow-sm ring-1 ring-neutral-600'
                          : 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">
                          {model.categoryLabel}
                        </span>
                        <h4 className="text-xs font-semibold text-white leading-tight line-clamp-2">
                          {model.name}
                        </h4>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-800/60 text-[10px] font-mono text-neutral-400">
                        <span className="text-emerald-400 font-medium truncate">{model.polygons}</span>
                        <span className="text-neutral-500 text-[9px] hidden sm:inline">{model.dimensions.split('×')[0]}мм</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Интерактивный 3D вьювер выбранной модели */}
              <div className="space-y-4">
                <ThreeModelViewer model={{ ...currentModel, fileUrl: getAssetUrl(currentModel.fileUrl) }} />

                {/* Метаданные выбранной модели */}
                <div className="border border-neutral-800 bg-neutral-900/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{currentModel.name}</h3>
                      <span className="text-[11px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                        {currentModel.polygons}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        <span>Габариты: {currentModel.dimensions}</span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
                      {currentModel.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 font-mono text-xs text-neutral-400">
                    <a
                      href={getAssetUrl(currentModel.fileUrl)}
                      download={currentModel.fileName}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-neutral-700 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Скачать .STL</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              РАЗДЕЛ: ИНТЕРЕСНЫЕ ССЫЛКИ (20 ИЗБРАННЫХ РЕСУРСОВ)
             ========================================================================= */}
          {activeSection === 'links' && (
            <div className="space-y-6">
              {/* Верхняя панель фильтров и поиска */}
              <div className="space-y-4 border-b border-neutral-800 pb-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Поиск */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск по ссылкам и темам..."
                      className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Счетчик */}
                  <div className="text-xs font-mono text-neutral-400 self-end sm:self-center">
                    Найдено: <span className="text-emerald-400 font-semibold">{filteredLinks.length}</span> из {links.length}
                  </div>
                </div>

                {/* Категории */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'Все', count: links.length },
                    { id: 'games', label: 'Игры & Ретро', count: links.filter(l => l.category === 'games').length },
                    { id: 'interactive', label: 'Интерактив & ИИ', count: links.filter(l => l.category === 'interactive').length },
                    { id: 'media', label: 'Медиа & Аудио', count: links.filter(l => l.category === 'media').length },
                    { id: 'tech', label: 'Софт & Железо', count: links.filter(l => l.category === 'tech').length },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveLinkCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        activeLinkCategory === cat.id
                          ? 'bg-neutral-800 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Сетка карточек ссылок */}
              {filteredLinks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4.5 rounded-xl border border-neutral-800 bg-neutral-900/25 hover:border-neutral-750 hover:bg-neutral-900/50 transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                            {item.badge}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-500 truncate max-w-[180px]">
                            {item.subtitle}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between gap-2">
                            <span className="truncate">{item.title}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                          </h4>
                          <p className="text-xs text-neutral-300 mt-1 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400 group-hover:text-emerald-400 transition-colors">
                        <span className="truncate max-w-[240px] text-neutral-500 group-hover:text-neutral-400">
                          {item.url.replace(/^https?:\/\//, '')}
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-neutral-800 rounded-xl space-y-2">
                  <p className="text-sm text-neutral-400">Ничего не найдено по запросу «{searchQuery}»</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveLinkCategory('all'); }}
                    className="text-xs text-emerald-400 hover:underline font-mono"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}

            </div>
          )}
        </section>

        {/* =========================================================================
            ПОДВАЛ & ЭКСПОРТ ДЛЯ GITHUB
           ========================================================================= */}
        <footer className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            <span>&copy; {new Date().getFullYear()} Romosol &bull; </span>
            <a 
              href="https://github.com/Romosol" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-neutral-300 underline underline-offset-4"
            >
              github.com/Romosol
            </a>
          </div>


        </footer>
      </div>

      {/* =========================================================================
          МОДАЛЬНОЕ ОКНО: ЗАГАДКА (ИЗ JS.JS)
         ========================================================================= */}
      {showRiddle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Загадка для Умных</h3>
              </div>
              <button
                onClick={() => {
                  setShowRiddle(false);
                  setRiddleAnswer('');
                }}
                className="text-neutral-500 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm leading-relaxed font-serif italic">
              «Универсалии могут существовать как сущности конкретных вещей, или они являются лишь порождениями разума?»
            </div>

            {/* Поле для ответа */}
            <form onSubmit={handleRiddleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                  Ваш ответ:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={riddleAnswer}
                    onChange={(e) => setRiddleAnswer(e.target.value)}
                    placeholder="Введите ответ..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                  >
                    <span>Ответить</span>
                  </button>
                </div>
              </div>

            </form>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
              <span className="text-[11px] text-neutral-500">
                Нажмите Enter для отправки
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowRiddle(false);
                  setRiddleAnswer('');
                }}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          МОДАЛЬНОЕ ОКНО: ОТВЕТ НА ЗАГАДКУ ("Ага, я тоже так думаю")
         ========================================================================= */}
      {showRiddleResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                Ага, я тоже так думаю
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowRiddleResponse(false);
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition cursor-pointer active:scale-95"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          МОДАЛЬНОЕ ОКНО: КОМАНДЫ ДЛЯ GITHUB PAGES
         ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Обновление репозитория Romosol.github.io</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-neutral-500 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Чтобы этот новый дизайн появился прямо на вашем сайте <code className="text-emerald-400 font-mono">https://romosol.github.io/</code>:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-emerald-400 space-y-1">
                <div>git add .</div>
                <div>git commit -m &quot;Add all 13 real STL models with dimensions and categories&quot;</div>
                <div>git push origin main</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition cursor-pointer"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
