// ======================================
// بوت نقاط فقط (زيادة + خصم + عرض + ترقيات + me + مهام + ارسال رسائل بالخاص)
// ======================================

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
} = require("discord.js");

const fs = require("fs");

// ========== إعدادات ==========
const config = {
  TOKEN: "MTQ1ODg4MzQzMjE1NDE0MDc4NA.GDePJM.mAwYGJtrE2EY5V6GP_R4ska9PG7mxOG--fdT1c",

  // رتبة عليا جديدة للأمر !
  highRole: "1462405819294290013",

  // رتبة المستلمين للرسائل
  logoRole: "1390378827351457923",

  dataFile: "./data.json",

  // رتبة الأشخاص اللي نقاطهم تحت 90
  lowRank: "1458578885515153422",
};

// ========== إنشاء ملف البيانات ==========
if (!fs.existsSync(config.dataFile)) {
  fs.writeFileSync(config.dataFile, JSON.stringify({ users: {} }, null, 2));
}

let data = require("./data.json");

// ========== إنشاء البوت ==========
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ========== حفظ البيانات ==========
function saveData() {
  fs.writeFileSync(config.dataFile, JSON.stringify(data, null, 2));
}

// ========== نظام الترقيات ==========
const ranks = [
  { id: "1463798106586874063", points: 90 },
  { id: "1458579080722255903", points: 150 },
  { id: "1458579263249973258", points: 310 },
  { id: "1458579380640157841", points: 430 },
  { id: "1458579920325185586", points: 720 },
  { id: "1464998951571947652", points: 1000 },
  { id: "1464999680084672534", points: 1300 },
  { id: "1465000082456707261", points: 1700 },
];

function getRank(points) {
  if (points < 90) return `<@&${config.lowRank}>`;
  let current = "بدون رتبة";
  for (let r of ranks) {
    if (points >= r.points) current = `<@&${r.id}>`;
  }
  return current;
}

// ========== الأوامر ==========
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();

// ====== أمر !نظام ======
if (message.content === "!نظام") {
  const embed = new EmbedBuilder()
    .setTitle(" نظام الإدارة")
    .setDescription(
      `• ___نظام النقاط الكامل يوجد هنا___\n\n• ___نظام الترقيات الصغرى هنا___`
    )
    .setImage(
      "https://cdn.discordapp.com/attachments/1471960920547917944/1471972058177994866/IMG_7552.png"
    )
    .setColor(0x800080);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("points_admin")
      .setLabel("النقاط الإدارية")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("ranks_admin")
      .setLabel("الترقيات الإدارية")
      .setStyle(ButtonStyle.Secondary)
  );

  await message.channel.send({
    embeds: [embed],
    components: [row],
  });
}

// ====== نظام الأزرار بالكامل ======
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // زر النقاط الإدارية
  if (interaction.customId === "points_admin") {
    const embed = new EmbedBuilder()
      .setTitle("__المهام الإدارية__")
      .setDescription(
        `__المهام الإداريه__ 
انشاء لعبة بمنشن | 5 نقاط
انشاء لعبة دون منشن | 1 نقطه 
استلام تكت | 7 نقاط
محاسبة شخص | 4 نقاط 
مشاركه في لعبة بمنشن | 4 نقاط 
مشاركة في لعبة دون منشن | 1 نقطه 

__ مهام XB اليومي والاسبوعي __
تحقيق 1000 XB في الشات يومي | 5 نقاط
تحقيق 1000 XB في الصوت | 5 نقاط 

تحقيق 3000 XB في الشات في الأسبوع | 13 نقطه
تحقيق 3000 XB في الصوت في الأسبوع | 13 نقطه`
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1471960920547917944/1471972058177994866/IMG_7552.png"
      )
      .setColor(0x800080);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  // زر الترقيات الإدارية
  if (interaction.customId === "ranks_admin") {
    const embed = new EmbedBuilder()
      .setTitle("__ترقيات الإدارة__")
      .setDescription(
        `<@&1463798106586874063> | النقاط المطلوبة 90
<@&1458579080722255903> | النقاط المطلوبة 150
<@&1458579263249973258> | النقاط المطلوبة 310
<@&1458579380640157841> | النقاط المطلوبة 430
<@&1458579920325185586> | النقاط المطلوبة 720
<@&1464998951571947652> | النقاط المطلوبة 1000
<@&1464999680084672534> | النقاط المطلوبة 1300
<@&1465000082456707261> | النقاط المطلوبة 1700`
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1471960920547917944/1471972058177994866/IMG_7552.png"
      )
      .setColor(0x800080);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
});
  // ===================== !me =====================
  if (content === "!me") {
    const pts = data.users[message.author.id] || 0;
    const embed = new EmbedBuilder()
      .setTitle("📌 معلوماتك")
      .setDescription(`
• الاسم: <@${message.author.id}>
• النقاط: **${pts}**
• الرتبة: ${getRank(pts)}
`)
      .setColor(0x00ffff);
    return message.channel.send({ embeds: [embed] });
  }

  // ===================== !ترقيات =====================
  if (content === "!ترقيات") {
    let text = "__النقاط المطلوبه للترقيه__\n\n";
    ranks.forEach((r) => {
      text += `<@&${r.id}> | **${r.points} نقطة**\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("📈 ترقيات الإدارة")
      .setDescription(text)
      .setImage(
        "https://cdn.discordapp.com/attachments/1471960920547917944/1471972058177994866/IMG_7552.png?ex=6990e04e&is=698f8ece&hm=a214bfbf2e84cabe97377a55c0be320493a9ef3d7dab876d5f97e9feffdcc15f&"
      )
      .setColor(0x8000ff); // لون بنفسجي

    return message.channel.send({ embeds: [embed] });
  }

  // ===================== !مهام =====================
  if (content === "!مهام") {
    const embed = new EmbedBuilder()
      .setTitle("📝 المهام اليومية والأسبوعية")
      .setDescription(`
__المهام الإداريه__
انشاء لعبة بمنشن | 5 نقاط
انشاء لعبة دون منشن | 1 نقطه
استلام تكت | 7 نقاط
محاسبة شخص | 4 نقاط
مشاركه في لعبة بمنشن | 4 نقاط
مشاركة في لعبة دون منشن | 1 نقطه

__مهام XB اليومي والاسبوعي__
تحقيق 1000 XB في الشات يومي | 5 نقاط
تحقيق 1000 XB في الصوت | 5 نقاط
تحقيق 3000 XB في الشات في الأسبوع | 13 نقطه
تحقيق 3000 XB في الصوت في الأسبوع | 13 نقطه
`)
      .setColor(0x8000ff)
      .setImage(
        "https://cdn.discordapp.com/attachments/1471960920547917944/1471972058177994866/IMG_7552.png?ex=6990e04e&is=698f8ece&hm=a214bfbf2e84cabe97377a55c0be320493a9ef3d7dab876d5f97e9feffdcc15f&"
      );

    return message.channel.send({ embeds: [embed] });
  }

  // ===================== !n =====================
  if (content === "!n") {
    const sorted = Object.entries(data.users)
      .filter(([id, pts]) => pts > 0)
      .sort((a, b) => b[1] - a[1]);

    let text = "";
    let i = 1;

    for (let [id, pts] of sorted) {
      text += `${i}- <@${id}> | ${pts} نقطة\n`;
      i++;
    }

    const embed = new EmbedBuilder()
      .setTitle("📋 ترتيب النقاط")
      .setDescription(text || "لا يوجد أحد عنده نقاط حالياً")
      .setColor(0x808080);

    return message.channel.send({ embeds: [embed] });
  }

  // ===================== !n @user (+/-) =====================
  if (content.startsWith("!n ")) {
    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ منشن الشخص!");

    const args = content.split(" ");
    const change = args[2];

    let pts = data.users[member.id] || 0;

    if (!change) {
      const embed = new EmbedBuilder()
        .setTitle("📌 معلومات العضو")
        .setDescription(`
• الاسم: <@${member.id}>
• النقاط: **${pts}**
• الرتبة: ${getRank(pts)}
`)
        .setColor(0x00ffff);
      return message.channel.send({ embeds: [embed] });
    }

    const num = parseInt(change);
    if (isNaN(num)) {
      return message.reply("❌ لازم تكتب رقم مثل +4 أو -3");
    }

    const oldPts = pts;
    pts += num;
    if (pts < 0) pts = 0;
    data.users[member.id] = pts;
    saveData();

    const embed = new EmbedBuilder()
      .setTitle("✅ تم تحديث النقاط")
      .setDescription(`
• العضو: <@${member.id}>
• النقاط السابقة: **${oldPts}**
• النقاط الجديدة: **${pts}**
• الرتبة الحالية: ${getRank(pts)}
`)
      .setColor(0x00ff00);
    return message.channel.send({ embeds: [embed] });
  }

  // ===================== ! (إرسال رسالة للرتبة الجديدة عبر مودال) =====================
  if (content === "!") {
    if (!message.member.roles.cache.has(config.highRole)) {
      return message.reply("❌ هذا الأمر للإدارة فقط");
    }

    const modal = new ModalBuilder()
      .setCustomId("send_logo_message")
      .setTitle("إرسال رسالة");

    const input = new TextInputBuilder()
      .setCustomId("msg")
      .setLabel("اكتب الرساله هنا")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    return message.channel.send({
      content: "📩 اضغط الزر لإرسال رسالة",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("open_logo_modal")
            .setLabel("✉️ إرسال رسالة")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  }
});

// ========== الأزرار ==========
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "open_logo_modal") {
    if (!interaction.member.roles.cache.has(config.highRole)) {
      return interaction.reply({
        content: "❌ هذا الأمر للإدارة فقط",
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("send_logo_message")
      .setTitle("إرسال رسالة");

    const input = new TextInputBuilder()
      .setCustomId("msg")
      .setLabel("اكتب الرساله هنا")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    return interaction.showModal(modal);
  }

  // ===== تعديل النقاط =====
  const [action, userId] = interaction.customId.split("_");

  if (!interaction.member.roles.cache.has(config.highRole)) {
    return interaction.reply({
      content: "❌ ما عندك صلاحية",
      ephemeral: true,
    });
  }

  if (action === "add" || action === "sub") {
    const modal = new ModalBuilder()
      .setCustomId(`${action}_modal_${userId}`)
      .setTitle("تعديل النقاط");

    const input = new TextInputBuilder()
      .setCustomId("points")
      .setLabel("اكتب عدد النقاط")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    return interaction.showModal(modal);
  }
});

// ========== المودال ==========
client.on("interactionCreate", async (interaction) => {
  if (interaction.type !== InteractionType.ModalSubmit) return;

  // إرسال الرسالة للرتبة الجديدة مباشرة
  if (interaction.customId === "send_logo_message") {
    const text = interaction.fields.getTextInputValue("msg");

    const role = interaction.guild.roles.cache.get(config.logoRole);
    if (!role) return interaction.reply({ content: "❌ رتبة المستلمين غير موجودة", ephemeral: true });

    role.members.forEach((member) => {
      member.send(text).catch(() => {});
    });

    return interaction.reply({ content: "✅ تم إرسال الرسالة بالخاص", ephemeral: true });
  }

  const parts = interaction.customId.split("_");
  const action = parts[0];
  const userId = parts[2];

  const num = parseInt(interaction.fields.getTextInputValue("points"));
  if (isNaN(num)) {
    return interaction.reply({ content: "❌ لازم رقم", ephemeral: true });
  }

  if (!data.users[userId]) data.users[userId] = 0;
  if (action === "add") data.users[userId] += num;
  if (action === "sub") data.users[userId] -= num;
  if (data.users[userId] < 0) data.users[userId] = 0;

  saveData();

  return interaction.reply({
    content: "✅ تم تحديث النقاط بنجاح",
    ephemeral: true,
  });
});

// تشغيل البوت
client.login(config.TOKEN);
