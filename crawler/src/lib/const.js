import "dotenv/config";

function hoursToMs(hours) {
  return hours * 60 * 60 * 1000;
}

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const LOG_LEVEL = process.env.LOG_PATH || "debug";

// should there be a cron job to upload the exported data to s3 automatically?
export const AUTO_UPLOAD_S3 = process.env.AUTO_UPLOAD_S3 || false;

export const REDIS_DUMP_FILE =
  process.env.REDIS_DUMP_FILE || ".data/redis/dump.rdb";
export const CHECKPOINT_DIR = process.env.CHECKPOINT_DIR || ".data/checkpoint/";

export const AWS_REGION = process.env.AWS_REGION || "ap-southeast-2";
export const PUBLISH_S3_BUCKET =
  process.env.PUBLISH_S3_BUCKET || "lemmyexplorer-build-prod-buildbucket";

// these control the timeouts for the worker task length
export const CRAWL_TIMEOUT = {
  INSTANCE: 30 * 60 * 1000, // 30 mins
  COMMUNITY: 120 * 60 * 1000, // 2 hours
  KBIN: 60 * 60 * 1000, // one hour
};

// max age to be included in output
export const OUTPUT_MAX_AGE = {
  INSTANCE: hoursToMs(18),
  COMMUNITY: hoursToMs(18),
  MAGAZINE: hoursToMs(18),
};

// controls the time before manual re-scan of old objects
export const CRAWL_AGED_TIME = {
  INSTANCE: hoursToMs(8),
  COMMUNITY: hoursToMs(8),

  // if a server is identified as a non-lemmy server, ho often should we wait before checking again?
  FEDIVERSE: hoursToMs(2 * 24), // 2 days
};

// consider for deletion after they haven't been seen for this long
// they are added to manually scan one last time before finally beign deleted
export const CRAWL_DELETE_TIME = {
  COMMUNITY: hoursToMs(13),
};

// when should these records expire from redis - min time between scans
export const RECORD_TTL_TIMES_SECONDS = {
  LAST_CRAWL: 6 * 60 * 60, // records won't be re-scanned if there is a last_crawl entry fort them
  ERROR: 8 * 60 * 60, // errors should be retried less frequently
};

export const CRON_SCHEDULES = {
  PUBLISH_S3: process.env.PUBLISH_S3_CRON || "0 */4 * * *", // every 4 hours
  AGED: "*/15 * * * *",
  UPTIME: "0 */12 * * *",
  KBIN: "0 */6 * * *",
  FEDISEER: "0 */12 * * *",
};

// for each request we make, after how much time should axios be configured to timeout
export const AXIOS_REQUEST_TIMEOUT = 60 * 1000; // 60 seconds in ms

export const FEDDIT_URLS = [
  "0xdd.org.ru",
  "1337lemmy.com",
  "aiparadise.moe",
  "anarch.is",
  "apollo.town",
  "aussie.zone",
  "bakchodi.org",
  "baomi.tv",
  "baraza.africa",
  "bbs.9tail.net",
  "bbs.darkwitch.net",
  "beehaw.org",
  "bluuit.org",
  "board.minimally.online",
  "bolha.social",
  "booty.world",
  "bulletintree.com",
  "butts.international",
  "cigar.cx",
  "civilloquy.com",
  "clatter.eu",
  "code4lib.net",
  "collapse.cat",
  "communick.news",
  "community.nicfab.it",
  "compuverse.uk",
  "cubing.social",
  "dataterm.digital",
  "diggit.xyz",
  "discuss.jacen.moe",
  "discuss.ntfy.sh",
  "discuss.online",
  "discuss.tchncs.de",
  "dmv.social",
  "donky.social",
  "dormi.zone",
  "drak.gg",
  "eslemmy.es",
  "eviltoast.org",
  "exploding-heads.com",
  "fanaticus.social",
  "feddi.no",
  "feddit.ch",
  "feddit.cl",
  "feddit.de",
  "feddit.dk",
  "feddit.eu",
  "feddit.it",
  "feddit.jp",
  "feddit.nl",
  "federotica.com",
  "fedibb.ml",
  "fediverse.ro",
  "fig.systems",
  "footkaput.com",
  "foros.fediverso.gal",
  "forum.nobigtech.es",
  "granitestate.social",
  "group.lt",
  "hakbox.social",
  "haynerds.com",
  "hc.frorayz.tech",
  "info.prou.be",
  "infosec.pub",
  "innernet.link",
  "invariant-marxism.red",
  "ka.tet42.org",
  "kyu.de",
  "l.nulltext.org",
  "labdegato.com",
  "latte.isnot.coffee",
  "lem.ph3j.com",
  "lem.simple-gear.com",
  "lemm.ee",
  "lemmit.online",
  "lemmit.xyz",
  "lemmy-ujt-u4842.vm.elestio.app",
  "lemmy.4d2.org",
  "lemmy.ananace.dev",
  "lemmy.anji.nl",
  "lemmy.antemeridiem.xyz",
  "lemmy.best",
  "lemmy.blahaj.zone",
  "lemmy.borlax.com",
  "lemmy.bulwarkob.com",
  "lemmy.burdocksoft.com",
  "lemmy.burger.rodeo",
  "lemmy.ca",
  "lemmy.cablepick.net",
  "lemmy.cafe",
  "lemmy.click",
  "lemmy.cnschn.com",
  "lemmy.cock.social",
  "lemmy.com.tr",
  "lemmy.comfysnug.space",
  "lemmy.coupou.fr",
  "lemmy.dbzer0.com",
  "lemmy.dcrich.net",
  "lemmy.deadca.de",
  "lemmy.directory",
  "lemmy.dormedas.com",
  "lemmy.dougiverse.io",
  "lemmy.douwes.co.uk",
  "lemmy.dupper.net",
  "lemmy.easfrq.live",
  "lemmy.einval.net",
  "lemmy.eus",
  "lemmy.fdvrs.xyz",
  "lemmy.fedisonic.cloud",
  "lemmy.fediverse.jp",
  "lemmy.film",
  "lemmy.fmhy.ml",
  "lemmy.frozeninferno.xyz",
  "lemmy.fun",
  "lemmy.gjz010.com",
  "lemmy.glasgow.social",
  "lemmy.graz.social",
  "lemmy.gsp8181.co.uk",
  "lemmy.helios42.de",
  "lemmy.helvetet.eu",
  "lemmy.hopskipjump.cloud",
  "lemmy.hpost.no",
  "lemmy.initq.net",
  "lemmy.intai.tech",
  "lemmy.jerick.xyz",
  "lemmy.johnpanos.com",
  "lemmy.jpaulus.io",
  "lemmy.jpiolho.com",
  "lemmy.juggler.jp",
  "lemmy.keychat.org",
  "lemmy.knocknet.net",
  "lemmy.ko4abp.com",
  "lemmy.kya.moe",
  "lemmy.loomy.li",
  "lemmy.maples.dev",
  "lemmy.matthe815.dev",
  "lemmy.media",
  "lemmy.menos.gotdns.org",
  "lemmy.mentalarts.info",
  "lemmy.ml",
  "lemmy.my.id",
  "lemmy.nauk.io",
  "lemmy.nerdcore.social",
  "lemmy.nexus",
  "lemmy.nine-hells.net",
  "lemmy.notdead.net",
  "lemmy.nrd.li",
  "lemmy.nz",
  "lemmy.one",
  "lemmy.otakufarms.com",
  "lemmy.parasrah.com",
  "lemmy.pastwind.top",
  "lemmy.pe1uca.dev",
  "lemmy.perthchat.org",
  "lemmy.picote.ch",
  "lemmy.pimenta.pt",
  "lemmy.pineapplemachine.com",
  "lemmy.pipe01.net",
  "lemmy.plasmatrap.com",
  "lemmy.podycust.co.uk",
  "lemmy.ppl.town",
  "lemmy.pt",
  "lemmy.ptznetwork.org",
  "lemmy.reckless.dev",
  "lemmy.redkrieg.com",
  "lemmy.rimkus.it",
  "lemmy.rogers-net.com",
  "lemmy.rollenspiel.monster",
  "lemmy.roombob.cat",
  "lemmy.s9m.xyz",
  "lemmy.saik0.com",
  "lemmy.scam-mail.me",
  "lemmy.schuerz.at",
  "lemmy.sdf.org",
  "lemmy.secnd.me",
  "lemmy.services.coupou.fr",
  "lemmy.smeargle.fans",
  "lemmy.snoot.tube",
  "lemmy.spacestation14.com",
  "lemmy.sprawl.club",
  "lemmy.srv.eco",
  "lemmy.staphup.nl",
  "lemmy.starlightkel.xyz",
  "lemmy.studio",
  "lemmy.tanktrace.de",
  "lemmy.tedomum.net",
  "lemmy.tf",
  "lemmy.tillicumnet.com",
  "lemmy.today",
  "lemmy.toot.pt",
  "lemmy.towards.vision",
  "lemmy.trippy.pizza",
  "lemmy.tuiter.ovh",
  "lemmy.umainfo.live",
  "lemmy.uncomfortable.business",
  "lemmy.uninsane.org",
  "lemmy.utopify.org",
  "lemmy.vanoverloop.xyz",
  "lemmy.villa-straylight.social",
  "lemmy.vrchat-dev.tech",
  "lemmy.w9r.de",
  "lemmy.weckhorst.no",
  "lemmy.wizjenkins.com",
  "lemmy.world",
  "lemmy.wtf",
  "lemmy.wxbu.de",
  "lemmy.xoynq.com",
  "lemmy.zip",
  "lemmy.zmiguel.me",
  "lemmy2.addictmud.org",
  "lemmybedan.com",
  "lemmydeals.com",
  "lemmyfly.org",
  "lemmygrad.ml",
  "lemmyland.com",
  "lemmyngs.social",
  "lemmynsfw.com",
  "lemmypets.xyz",
  "lemmyrs.org",
  "lib.lgbt",
  "liminal.southfox.me",
  "link.fossdle.org",
  "linkage.ds8.zone",
  "links.decafbad.com",
  "links.hackliberty.org",
  "links.rocks",
  "links.roobre.es",
  "lm.gsk.moe",
  "lm.korako.me",
  "lm.paradisus.day",
  "lm.qtt.no",
  "lmmy.net",
  "lostcheese.com",
  "mander.xyz",
  "matejc.com",
  "merv.news",
  "midwest.social",
  "mindshare.space",
  "monero.house",
  "mujico.org",
  "mylem.my",
  "negativenull.com",
  "news.deghg.org",
  "news.juliette.page",
  "no.lastname.nz",
  "nuniandfamily.com",
  "omg.qa",
  "orava.dev",
  "outpost.zeuslink.net",
  "partizle.com",
  "pathfinder.social",
  "pathofexile-discuss.com",
  "pawb.social",
  "philly.page",
  "popplesburger.hilciferous.nl",
  "poptalk.scrubbles.tech",
  "possumpat.io",
  "posta.no",
  "programming.dev",
  "quex.cc",
  "radiation.party",
  "rammy.site",
  "read.widerweb.org",
  "reddthat.com",
  "remmy.dragonpsi.xyz",
  "retarded.dev",
  "seemel.ink",
  "sffa.community",
  "sh.itjust.works",
  "sha1.nl",
  "sigmet.io",
  "slangenettet.pyjam.as",
  "slrpnk.net",
  "social.sour.is",
  "sopuli.xyz",
  "stammtisch.hallertau.social",
  "startrek.website",
  "streetbikes.club",
  "sub.wetshaving.social",
  "suppo.fi",
  "szmer.info",
  "tezzo.f0rk.pl",
  "theotter.social",
  "thesimplecorner.org",
  "toast.ooo",
  "toons.zone",
  "tucson.social",
  "vlemmy.net",
  "voxpop.social",
  "waveform.social",
  "wayfarershaven.eu",
  "whatyoulike.club",
  "whiskers.bim.boats",
  "yiffit.net",
  "zemmy.cc",
  "zoo.splitlinux.org",
];

export const START_URLS = [
  "lemmy.tgxn.net",
  "lemmygrad.ml",
  "lemmynsfw.com",
  "lemmy.mods4ever.com",
  ...FEDDIT_URLS,
];

// used for the crawler headers when making requests
export const CRAWLER_USER_AGENT = "lemmy-explorer-crawler/1.0.0";
export const CRAWLER_ATTRIB_URL = "https://lemmyverse.net";
