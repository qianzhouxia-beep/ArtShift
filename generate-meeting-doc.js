const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        Header, Footer, PageNumber } = require('docx');
const fs = require('fs');

// 创建文档
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1E3A8A" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "3730A3" },
        paragraph: { spacing: { before: 280, after: 200 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "4F46E5" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "ArtShift MVP 技术选型评审会", size: 20, color: "666666" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "第 ", size: 20 }),
            new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
            new TextRun({ text: " 页", size: 20 })
          ]
        })]
      })
    },
    children: [
      // 标题
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("ArtShift MVP 技术选型评审会")]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "会议日期：2026-05-18", size: 22, color: "666666" })]
      }),

      // 会议背景
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("一、会议背景")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("ArtShift 是一个 AI 图像生成 + 按需打印（POD）平台，目标市场为美国/欧洲。当前阶段为 MVP 开发，需要在以下三个关键技术决策上做出选择：")]
      }),
      new Paragraph({ children: [new TextRun("1. AI 图像生成接口选型")] }),
      new Paragraph({ children: [new TextRun("2. 数据库选型")] }),
      new Paragraph({ children: [new TextRun("3. 支付集成时机")] }),
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [new TextRun("本文档记录技术选型评审会的讨论过程及最终决策。")]
      }),

      // 议题一
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("二、议题一：AI 图像生成接口")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1 选项对比")] }),

      // 表格
      createComparisonTable(),

      new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 300 }, children: [new TextRun("2.2 各方意见")] }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Lead Engineer：", bold: true }),
          new TextRun("\"Stability AI API 最成熟，SDK 完善，SDXL 1.0 支持 1024x1024，按张计费无订阅费。DALL-E 3 贵 4 倍，且审核严格。Midjourney 非官方 API 不稳定，不推荐生产环境。\"")
        ]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Product Manager：", bold: true }),
          new TextRun("\"用户不在乎用什么模型，只在乎出图质量和速度。SDXL 质量足够，且可以微调我们的风格。\"")
        ]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Finance：", bold: true }),
          new TextRun("\"按 1000 张/天预估：Stability AI $10，DALL-E 3 $40，差 4 倍。MVP 阶段每天可能只有 10-50 张，但规模化后 Stability AI 明显更优。\"")
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.3 决策")] }),
      new Paragraph({
        shading: { fill: "ECFDF5", type: ShadingType.CLEAR },
        spacing: { before: 160, after: 200 },
        children: [
          new TextRun({ text: "✅ 推荐：Stability AI API (SDXL 1.0)", bold: true, color: "059669" }),
          new TextRun({ text: "\n\n理由：", bold: true }),
          new TextRun("\n• 性价比最高（$0.01/张 1024x1024）"),
          new TextRun("\n• 可控性强（支持 negative prompt、steps、CFG scale）"),
          new TextRun("\n• 可迁移到自部署（未来成本优化）"),
          new TextRun("\n• 备选方案：本地部署 SDXL（需要 GPU 服务器，适合日生成 > 5000 张时）")
        ]
      }),

      // 议题二
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("三、议题二：数据库选型")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 选项对比")] }),

      createDatabaseTable(),

      new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 300 }, children: [new TextRun("3.2 各方意见")] }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Lead Engineer：", bold: true }),
          new TextRun("\"PostgreSQL + Prisma 是 TypeScript 生态首选，类型安全，迁移管理完善。Supabase 本质是 PostgreSQL + 免费 BaaS，自带 Auth、Realtime、Storage，非常适合初创项目。\"")
        ]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "DevOps：", bold: true }),
          new TextRun("\"Supabase 免费额度够 MVP 用（500MB 数据库，1GB 文件存储）。如果用纯 PostgreSQL 需要自己搭服务器或买云服务，运维成本高。\"")
        ]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Product Manager：", bold: true }),
          new TextRun("\"MVP 需要用户账号、waitlist、生成历史，这些都需要 Auth。Supabase Auth 开箱即用，支持邮箱/魔法链接/OAuth，省去自己开发时间。\"")
        ]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Finance：", bold: true }),
          new TextRun("\"Supabase 免费额度覆盖 MVP 阶段（< 5000 用户）。如果自己搭 PostgreSQL + Auth0，成本 $25/月起。MVP 阶段省下的钱可以用于市场推广。\"")
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.3 决策")] }),
      new Paragraph({
        shading: { fill: "ECFDF5", type: ShadingType.CLEAR },
        spacing: { before: 160, after: 200 },
        children: [
          new TextRun({ text: "✅ 推荐：Supabase (PostgreSQL + BaaS)", bold: true, color: "059669" }),
          new TextRun({ text: "\n\n理由：", bold: true }),
          new TextRun("\n• 免费额度充足，MVP 零成本"),
          new TextRun("\n• 自带 Auth、Realtime、Storage，开发效率极高"),
          new TextRun("\n• 数据关系复杂时用 PostgreSQL，简单时用 MongoDB，但 Supabase 的 PostgreSQL 也支持 JSONB（兼具两者优点）"),
          new TextRun("\n• 备选方案：MongoDB Atlas（如果数据模型频繁变化）")
        ]
      }),

      // 议题三
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("四、议题三：支付集成时机")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1 各方意见")] }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Product Manager：", bold: true }),
          new TextRun("\"MVP 目标是验证需求，不是立即变现。先让用户免费生成 1-2 张图，留下邮箱（waitlist），等产品验证后再接入支付。Stripe 接入需要 2-3 天，MVP 阶段应该聚焦核心功能。\"")
        ]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Finance：", bold: true }),
          new TextRun("\"Stripe 手续费 2.9% + $0.3/笔，PayPal 类似。如果 MVP 阶段没有收入，提前接入只是增加开发成本。建议 Phase 2（产品市场契合后）再接入。\"")
        ]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Lead Engineer：", bold: true }),
          new TextRun("\"支付涉及 Webhook、订单状态机、退款逻辑，开发量 3-5 天。MVP 应该 2 周内上线，支付可以延后。但数据库设计时要预留 orders 表和 payment_status 字段。\"")
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.2 决策")] }),
      new Paragraph({
        shading: { fill: "ECFDF5", type: ShadingType.CLEAR },
        spacing: { before: 160, after: 200 },
        children: [
          new TextRun({ text: "✅ 推荐：MVP 阶段跳过支付，预留接口", bold: true, color: "059669" }),
          new TextRun({ text: "\n\n理由：", bold: true }),
          new TextRun("\n• Phase 1（MVP）：Waitlist + AI 生图 + 产品预览（无支付）"),
          new TextRun("\n• Phase 2（验证后）：接入 Stripe + Printful API"),
          new TextRun("\n• 现在要做：数据库 schema 预留 orders 表，未来无缝衔接")
        ]
      }),

      // 最终技术栈
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("五、最终技术栈")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "推荐技术栈总览：", bold: true })]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "Frontend:  ", bold: true }),
          new TextRun("React + Vite + Tailwind CSS（已有）")
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "Backend:   ", bold: true }),
          new TextRun("Next.js API Routes（全栈 TypeScript）")
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "Database:  ", bold: true }),
          new TextRun("Supabase（PostgreSQL + Prisma ORM）")
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "Auth:      ", bold: true }),
          new TextRun("Supabase Auth（邮箱/魔法链接）")
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "AI API:    ", bold: true }),
          new TextRun("Stability AI SDK（SDXL 1.0）")
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "Image CDN: ", bold: true }),
          new TextRun("Supabase Storage（生成图片存储）")
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Deploy:    ", bold: true }),
          new TextRun("Vercel（前端）+ Zeabur（后端 API）")
        ]
      }),

      // 开发周期
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("六、开发周期预估")] }),
      new Paragraph({ children: [new TextRun("Week 1：数据库设计 + Supabase 配置 + Auth 集成")] }),
      new Paragraph({ children: [new TextRun("Week 2：AI 生图 API 对接 + 前端交互")] }),
      new Paragraph({ children: [new TextRun("Week 3：产品预览（T恤/马克杯效果图）+ Waitlist")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Week 4：测试 + 部署 + 内测")] }),

      // 签名
      new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "整理人：AI 工程师秘书", color: "666666" })] }),
      new Paragraph({ children: [new TextRun({ text: "日期：2026-05-18", color: "666666" })] }),
    ]
  }]
});

// 创建 AI API 对比表格
function createComparisonTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2200, 1800, 1800, 1800, 1760],
    rows: [
      new TableRow({
        children: [
          createCell("API", borders, true, "DBEAFE"),
          createCell("成本 (1024x1024)", borders, true, "DBEAFE"),
          createCell("质量", borders, true, "DBEAFE"),
          createCell("速度", borders, true, "DBEAFE"),
          createCell("稳定性", borders, true, "DBEAFE"),
        ]
      }),
      new TableRow({
        children: [
          createCell("Stability AI (SDXL)", borders),
          createCell("$0.01", borders),
          createCell("⭐⭐⭐⭐", borders),
          createCell("快", borders),
          createCell("稳定", borders),
        ]
      }),
      new TableRow({
        children: [
          createCell("DALL-E 3", borders),
          createCell("$0.04", borders),
          createCell("⭐⭐⭐⭐⭐", borders),
          createCell("中", borders),
          createCell("稳定", borders),
        ]
      }),
      new TableRow({
        children: [
          createCell("Midjourney API", borders),
          createCell("~$0.02-0.05", borders),
          createCell("⭐⭐⭐⭐⭐", borders),
          createCell("慢", borders),
          createCell("不稳定（非官方）", borders),
        ]
      }),
    ]
  });
}

// 创建数据库对比表格
function createDatabaseTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 3280, 3280],
    rows: [
      new TableRow({
        children: [
          createCell("数据库", borders, true, "DBEAFE"),
          createCell("优势", borders, true, "DBEAFE"),
          createCell("劣势", borders, true, "DBEAFE"),
        ]
      }),
      new TableRow({
        children: [
          createCell("PostgreSQL + Prisma", borders),
          createCell("类型安全、成熟、关系型", borders),
          createCell("需要管理服务器", borders),
        ]
      }),
      new TableRow({
        children: [
          createCell("MongoDB Atlas", borders),
          createCell("灵活 schema、快速迭代", borders),
          createCell("关系查询弱", borders),
        ]
      }),
      new TableRow({
        children: [
          createCell("Supabase", borders),
          createCell("免费、内置 Auth/Storage、实时", borders),
          createCell("供应商锁定", borders),
        ]
      }),
    ]
  });
}

// 创建表格单元格
function createCell(text, borders, isHeader = false, fillColor = null) {
  return new TableCell({
    borders,
    width: { size: 1800, type: WidthType.DXA },
    shading: fillColor ? { fill: fillColor, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: isHeader, size: isHeader ? 22 : 20 })]
    })]
  });
}

// 生成文档
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("ArtShift-MVP技术选型评审会-20260518.docx", buffer);
  console.log("✅ Word 文档已生成: ArtShift-MVP技术选型评审会-20260518.docx");
}).catch(err => {
  console.error("❌ 生成失败:", err);
});
