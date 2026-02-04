import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ]
});

// ===============================
// ✅ إعدادات النظام الرسمية
// ===============================

const ALLOWED_ROLE_ID = "1466809916638630231";

const REGISTER_CHANNEL_ID = "1468651687026884862";
const DAILY_REPORT_CHANNEL_ID = "1468651749723213926";
const LOG_CHANNEL_ID = "1468651824625225901";

const OFFICIAL_IMAGE =
  "https://i.ibb.co/JwdtgYkv/VAULTA.png";

const OFFICIAL_AUDITOR = "M1";

// ===============================
// ✅ قواعد البيانات المؤقتة
// ===============================

const sessions = new Map();
const times = new Map();

// ===============================
// ✅ Embed لوحة التسجيل الرسمية
// ===============================

function registerEmbed() {
  return new EmbedBuilder()
    .setTitle("📌 نظام تسجيل الدخول والخروج")
    .setDescription("اختر أحد الخيارات بالأسفل")
    .addFields({
      name: "⚠️ تنبيه رسمي",
      value:
        "سيتم إرسال رسالة تأكيد خاصة لك كل **30 دقيقة**\nإذا لم ترد خلال **10 دقائق** سيتم خصم **30 دقيقة كاملة** من وقتك\nالنظام مراقب لا تحاول التلاعب أو الخش"
    })
    .setThumbnail(OFFICIAL_IMAGE)
    .setImage(OFFICIAL_IMAGE)
    .setColor("DarkRed");
}

// ===============================
// ✅ أزرار النظام الرسمية
// ===============================

function registerButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("login")
      .setLabel("تسجيل دخول")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("logout")
      .setLabel("تسجيل خروج")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId("mytime")
      .setLabel("إظهار وقتي")
      .setStyle(ButtonStyle.Secondary)
  );
}

// ===============================
// ✅ إرسال اللوحة تلقائياً بالروم
// ===============================

client.once("ready", async () => {
  console.log("✅ النظام اشتغل بالكامل");

  const registerChannel =
    await client.channels.fetch(REGISTER_CHANNEL_ID);

  registerChannel.send({
    embeds: [registerEmbed()],
    components: [registerButtons()]
  });

  console.log("✅ تم إرسال لوحة التسجيل الرسمية");
});

// ===============================
// ✅ التحقق من الرتبة المسموحة
// ===============================

function hasAllowedRole(member) {
  return member.roles.cache.has(ALLOWED_ROLE_ID);
}

// ===============================
// ✅ التعامل مع الأزرار
// ===============================

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const member = interaction.member;
  const userId = interaction.user.id;

  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);

  // ===============================
  // ❌ منع غير المصرح لهم
  // ===============================

  if (!hasAllowedRole(member)) {
    return interaction.reply({
      content:
        "❌ لا يمكنك استخدام نظام التسجيل لأنك لا تملك الرتبة المسموح لها بالتسجيل",
      ephemeral: true
    });
  }

  // ===============================
  // ✅ تسجيل دخول
  // ===============================

  if (interaction.customId === "login") {
    sessions.set(userId, {
      status: "in",
      awaiting: false
    });

    logChannel.send(
      `📌 العضو ${interaction.user.tag} قام بتسجيل دخول رسمي داخل النظام`
    );

    return interaction.reply({
      content: "✅ تم تسجيل دخولك بنجاح داخل نظام الإدارة",
      ephemeral: true
    });
  }

  // ===============================
  // ✅ تسجيل خروج
  // ===============================

  if (interaction.customId === "logout") {
    sessions.delete(userId);

    logChannel.send(
      `📌 العضو ${interaction.user.tag} قام بتسجيل خروج رسمي من النظام`
    );

    return interaction.reply({
      content: "❌ تم تسجيل خروجك بنجاح من نظام الإدارة",
      ephemeral: true
    });
  }

  // ===============================
  // ✅ عرض الوقت
  // ===============================

  if (interaction.customId === "mytime") {
    let current = times.get(userId) || 0;

    return interaction.reply({
      content: `⏳ وقتك الحالي داخل النظام هو: **${current} دقيقة**`,
      ephemeral: true
    });
  }
});

// ===============================
// ✅ رسالة تأكيد DM كل 30 دقيقة
// ===============================

setInterval(async () => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);

  for (let [userId, data] of sessions) {
    if (data.status === "in") {
      const user = await client.users.fetch(userId);

      data.awaiting = true;

      user.send(
        "⚠️ تنبيه رسمي من نظام الإدارة:\nيجب عليك تأكيد حضورك الآن خلال 10 دقائق حتى لا يتم خصم 30 دقيقة كاملة من وقتك"
      );

      logChannel.send(
        `📌 تم إرسال رسالة تأكيد خاصة للعضو ${user.tag}`
      );

      // ===============================
      // خصم إذا ما رد خلال 10 دقائق
      // ===============================

      setTimeout(() => {
        if (data.awaiting) {
          let current = times.get(userId) || 0;
          times.set(userId, current - 30);

          logChannel.send(
            `❌ العضو ${user.tag} لم يقم بتأكيد حضوره خلال 10 دقائق وتم خصم 30 دقيقة كاملة من وقته`
          );

          data.awaiting = false;
        }
      }, 10 * 60 * 1000);
    }
  }
}, 30 * 60 * 1000);

// ===============================
// ✅ الجرد اليومي الساعة 12 ليلاً
// ===============================

async function dailyReport() {
  const reportChannel =
    await client.channels.fetch(DAILY_REPORT_CHANNEL_ID);

  let list = [];

  for (let [userId, mins] of times) {
    const user = await client.users.fetch(userId);

    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;

    list.push({
      name: user.tag,
      time: `${hours}h:${minutes}m`
    });
  }

  list.sort((a, b) => b.time.localeCompare(a.time));

  let reportText = list
    .map((u, i) => `${i + 1}. ${u.name} — ⏱ ${u.time}`)
    .join("\n");

  const embed = new EmbedBuilder()
    .setTitle("📋 جرد الوقت الرسمي")
    .setDescription(
      `تاريخ الجرد: ${new Date().toLocaleDateString()}\nمسؤول الجرد: ${OFFICIAL_AUDITOR}\n\nجرد الأعضاء بالكامل:\n\n${reportText}`
    )
    .setThumbnail(OFFICIAL_IMAGE)
    .setImage(OFFICIAL_IMAGE)
    .setColor("DarkRed");

  reportChannel.send({
    content: `<@&${ALLOWED_ROLE_ID}> هذا هو الجرد الرسمي لليوم، أي شخص يرى نفسه مظلوم يتواصل مع المسؤولين`,
    embeds: [embed]
  });
}

// ===============================
// ✅ تشغيل الجرد تلقائياً الساعة 12
// ===============================

setInterval(() => {
  const now = new Date();

  if (now.getHours() === 0 && now.getMinutes() === 0) {
    dailyReport();
  }
}, 60 * 1000);

// ===============================
// ✅ تشغيل البوت
// ===============================

client.login("MTQ2NjM1OTQ1NTI2NzQyNjQ5MA.GkxSS3.2Q8-AxrMyZOoGp3tK_e63qqof4Bjyvnui6JpEM");
