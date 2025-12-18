"use client";
import React, { useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

/* -------------------- DATA -------------------- */
const chartData = [
  {
    category: "2016",
    value: 4,
    subData: [
      {
        category: "Android Development",
        value: 2,
        projects: [
          {
            name: "Project Alpha",
            startDate: "2016-01-15",
            endDate: "2016-06-30",
            url: "https://portfolio.com/projects/project-alpha",
            image: "https://example.com/images/project-alpha.jpg",
            smallDescription: "A mobile app for task management with offline support."
          },
          {
            name: "Project Beta",
            startDate: "2016-03-10",
            endDate: "2016-09-20",
            url: "https://portfolio.com/projects/project-beta",
            image: "https://example.com/images/project-beta.jpg",
            smallDescription: "An Android utility app for productivity tracking."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 1,
        projects: [
          {
            name: "Shopify Store",
            startDate: "2016-02-01",
            endDate: "2016-05-15",
            url: "https://portfolio.com/projects/shopify-store",
            image: "https://example.com/images/shopify-store.jpg",
            smallDescription: "Custom Shopify theme for online retail with payment integration."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 1,
        projects: [
          {
            name: "Responsive Site",
            startDate: "2016-04-01",
            endDate: "2016-07-10",
            url: "https://portfolio.com/projects/responsive-site",
            image: "https://example.com/images/responsive-site.jpg",
            smallDescription: "Fully responsive website with mobile-first design principles."
          }
        ]
      }
    ]
  },
  {
    category: "2017",
    value: 7,
    subData: [
      {
        category: "Website (Mobile Compatible)",
        value: 2,
        projects: [
          {
            name: "Project Alpha",
            startDate: "2017-01-15",
            endDate: "2017-06-30",
            url: "https://portfolio.com/projects/project-alpha",
            image: "https://example.com/images/project-alpha.jpg",
            smallDescription: "Enhanced responsive web application for user engagement."
          },
          {
            name: "Project Beta",
            startDate: "2017-03-10",
            endDate: "2017-09-20",
            url: "https://portfolio.com/projects/project-beta",
            image: "https://example.com/images/project-beta.jpg",
            smallDescription: "Mobile-compatible site with advanced UI/UX features."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 3,
        projects: [
          {
            name: "Shopify Store",
            startDate: "2017-02-01",
            endDate: "2017-05-15",
            url: "https://portfolio.com/projects/shopify-store",
            image: "https://example.com/images/shopify-store.jpg",
            smallDescription: "Scalable e-commerce platform with inventory management."
          },
          {
            name: "Project Beta",
            startDate: "2017-04-01",
            endDate: "2017-08-30",
            url: "https://portfolio.com/projects/project-beta",
            image: "https://example.com/images/project-beta.jpg",
            smallDescription: "Custom online store with SEO optimizations."
          },
          {
            name: "Ecom Portal",
            startDate: "2017-06-15",
            endDate: "2017-10-20",
            url: "https://portfolio.com/projects/ecom-portal",
            image: "https://example.com/images/ecom-portal.jpg",
            smallDescription: "B2C e-commerce site with user authentication."
          }
        ]
      },
      {
        category: "Android Development",
        value: 2,
        projects: [
          {
            name: "Project Alpha",
            startDate: "2017-01-15",
            endDate: "2017-06-30",
            url: "https://portfolio.com/projects/project-alpha",
            image: "https://example.com/images/project-alpha.jpg",
            smallDescription: "Android app for social networking features."
          },
          {
            name: "Project Beta",
            startDate: "2017-03-10",
            endDate: "2017-09-20",
            url: "https://portfolio.com/projects/project-beta",
            image: "https://example.com/images/project-beta.jpg",
            smallDescription: "Utility Android app with push notifications."
          }
        ]
      }
    ]
  },
  {
    category: "2018",
    value: 4,
    subData: [
      {
        category: "Android Development",
        value: 2,
        projects: [
          {
            name: "Project Alpha",
            startDate: "2018-01-15",
            endDate: "2018-06-30",
            url: "https://portfolio.com/projects/project-alpha",
            image: "https://example.com/images/project-alpha.jpg",
            smallDescription: "Advanced Android app with API integrations."
          },
          {
            name: "Project Beta",
            startDate: "2018-03-10",
            endDate: "2018-09-20",
            url: "https://portfolio.com/projects/project-beta",
            image: "https://example.com/images/project-beta.jpg",
            smallDescription: "Cross-platform Android development tool."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 1,
        projects: [
          {
            name: "Shopify Store",
            startDate: "2018-02-01",
            endDate: "2018-05-15",
            url: "https://portfolio.com/projects/shopify-store",
            image: "https://example.com/images/shopify-store.jpg",
            smallDescription: "E-commerce site with custom checkout flows."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 1,
        projects: [
          {
            name: "Responsive Site",
            startDate: "2018-04-01",
            endDate: "2018-07-10",
            url: "https://portfolio.com/projects/responsive-site",
            image: "https://example.com/images/responsive-site.jpg",
            smallDescription: "Mobile-optimized landing pages and forms."
          }
        ]
      }
    ]
  },
  {
    category: "2019",
    value: 3,
    subData: [
      {
        category: "Android Development",
        value: 2,
        projects: [
          {
            name: "Project Alpha",
            startDate: "2019-01-15",
            endDate: "2019-06-30",
            url: "https://portfolio.com/projects/project-alpha",
            image: "https://example.com/images/project-alpha.jpg",
            smallDescription: "Feature-rich Android application for data syncing."
          },
          {
            name: "Project Beta",
            startDate: "2019-03-10",
            endDate: "2019-09-20",
            url: "https://portfolio.com/projects/project-beta",
            image: "https://example.com/images/project-beta.jpg",
            smallDescription: "Android SDK-based project for device compatibility."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 1,
        projects: [
          {
            name: "Shopify Store",
            startDate: "2019-02-01",
            endDate: "2019-05-15",
            url: "https://portfolio.com/projects/shopify-store",
            image: "https://example.com/images/shopify-store.jpg",
            smallDescription: "Optimized Shopify store for high-traffic sales."
          }
        ]
      }
    ]
  },
  {
    category: "2020",
    value: 4,
    subData: [
      {
        category: "Android Development",
        value: 2,
        projects: [
          {
            name: "Project Alpha",
            startDate: "2020-01-15",
            endDate: "2020-06-30",
            url: "https://portfolio.com/projects/project-alpha",
            image: "https://example.com/images/project-alpha.jpg",
            smallDescription: "Remote collaboration Android app developed during pandemic."
          },
          {
            name: "Project Beta",
            startDate: "2020-03-10",
            endDate: "2020-09-20",
            url: "https://portfolio.com/projects/project-beta",
            image: "https://example.com/images/project-beta.jpg",
            smallDescription: "Health tracking Android application."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 1,
        projects: [
          {
            name: "Shopify Store",
            startDate: "2020-02-01",
            endDate: "2020-05-15",
            url: "https://portfolio.com/projects/shopify-store",
            image: "https://example.com/images/shopify-store.jpg",
            smallDescription: "E-commerce platform with contactless payment options."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 1,
        projects: [
          {
            name: "Responsive Site",
            startDate: "2020-04-01",
            endDate: "2020-07-10",
            url: "https://portfolio.com/projects/responsive-site",
            image: "https://example.com/images/responsive-site.jpg",
            smallDescription: "Adaptive web design for virtual events."
          }
        ]
      }
    ]
  },
  {
    category: "2021",
    value: 6,
    subData: [
      {
        category: "Android Development",
        value: 1,
        projects: [
          {
            name: "Mobile App V2",
            startDate: "2021-01-20",
            endDate: "2021-04-05",
            url: "https://portfolio.com/projects/mobile-app-v2",
            image: "https://example.com/images/mobile-app-v2.jpg",
            smallDescription: "Updated version of mobile application with new features."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 3,
        projects: [
          {
            name: "Ecom Portal 1",
            startDate: "2021-02-15",
            endDate: "2021-06-20",
            url: "https://portfolio.com/projects/ecom-portal-1",
            image: "https://example.com/images/ecom-portal-1.jpg",
            smallDescription: "Full-stack e-commerce portal with admin dashboard."
          },
          {
            name: "Ecom Portal 2",
            startDate: "2021-05-10",
            endDate: "2021-08-15",
            url: "https://portfolio.com/projects/ecom-portal-2",
            image: "https://example.com/images/ecom-portal-2.jpg",
            smallDescription: "Multi-vendor marketplace platform."
          },
          {
            name: "Ecom Portal 3",
            startDate: "2021-07-01",
            endDate: "2021-10-30",
            url: "https://portfolio.com/projects/ecom-portal-3",
            image: "https://example.com/images/ecom-portal-3.jpg",
            smallDescription: "Subscription-based e-commerce solution."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 2,
        projects: [
          {
            name: "Corp Site",
            startDate: "2021-03-01",
            endDate: "2021-05-25",
            url: "https://portfolio.com/projects/corp-site",
            image: "https://example.com/images/corp-site.jpg",
            smallDescription: "Corporate website with mobile responsiveness."
          },
          {
            name: "Blog Platform",
            startDate: "2021-06-15",
            endDate: "2021-09-10",
            url: "https://portfolio.com/projects/blog-platform",
            image: "https://example.com/images/blog-platform.jpg",
            smallDescription: "Content management system for blogging."
          }
        ]
      }
    ]
  },
  {
    category: "2022",
    value: 8,
    subData: [
      {
        category: "Android Development",
        value: 3,
        projects: [
          {
            name: "Fitness App",
            startDate: "2022-01-01",
            endDate: "2022-06-01",
            url: "https://portfolio.com/projects/fitness-app",
            image: "https://example.com/images/fitness-app.jpg",
            smallDescription: "Workout tracking app with AI recommendations."
          },
          {
            name: "Game App",
            startDate: "2022-03-01",
            endDate: "2022-08-01",
            url: "https://portfolio.com/projects/game-app",
            image: "https://example.com/images/game-app.jpg",
            smallDescription: "Casual mobile game with multiplayer features."
          },
          {
            name: "Utility App",
            startDate: "2022-05-01",
            endDate: "2022-10-01",
            url: "https://portfolio.com/projects/utility-app",
            image: "https://example.com/images/utility-app.jpg",
            smallDescription: "Daily utility tool for file management."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 2,
        projects: [
          {
            name: "Marketplace",
            startDate: "2022-02-01",
            endDate: "2022-07-01",
            url: "https://portfolio.com/projects/marketplace",
            image: "https://example.com/images/marketplace.jpg",
            smallDescription: "Online marketplace for peer-to-peer sales."
          },
          {
            name: "Storefront",
            startDate: "2022-04-01",
            endDate: "2022-09-01",
            url: "https://portfolio.com/projects/storefront",
            image: "https://example.com/images/storefront.jpg",
            smallDescription: "Custom storefront with dynamic pricing."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 3,
        projects: [
          {
            name: "Portfolio",
            startDate: "2022-01-15",
            endDate: "2022-04-15",
            url: "https://portfolio.com/projects/portfolio",
            image: "https://example.com/images/portfolio.jpg",
            smallDescription: "Personal portfolio showcase site."
          },
          {
            name: "Dashboard",
            startDate: "2022-06-01",
            endDate: "2022-09-01",
            url: "https://portfolio.com/projects/dashboard",
            image: "https://example.com/images/dashboard.jpg",
            smallDescription: "Analytics dashboard for business insights."
          },
          {
            name: "Landing Page",
            startDate: "2022-07-01",
            endDate: "2022-10-01",
            url: "https://portfolio.com/projects/landing-page",
            image: "https://example.com/images/landing-page.jpg",
            smallDescription: "High-conversion landing page design."
          }
        ]
      }
    ]
  },
  {
    category: "2023",
    value: 10,
    subData: [
      {
        category: "Android Development",
        value: 2,
        projects: [
          {
            name: "Social App",
            startDate: "2023-01-01",
            endDate: "2023-05-01",
            url: "https://portfolio.com/projects/social-app",
            image: "https://example.com/images/social-app.jpg",
            smallDescription: "Social media app with real-time chat."
          },
          {
            name: "Edu App",
            startDate: "2023-03-01",
            endDate: "2023-08-01",
            url: "https://portfolio.com/projects/edu-app",
            image: "https://example.com/images/edu-app.jpg",
            smallDescription: "Educational platform for online learning."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 4,
        projects: [
          {
            name: "Admin Portal",
            startDate: "2023-02-01",
            endDate: "2023-06-01",
            url: "https://portfolio.com/projects/admin-portal",
            image: "https://example.com/images/admin-portal.jpg",
            smallDescription: "Backend admin interface for e-commerce."
          },
          {
            name: "Checkout",
            startDate: "2023-04-01",
            endDate: "2023-07-01",
            url: "https://portfolio.com/projects/checkout",
            image: "https://example.com/images/checkout.jpg",
            smallDescription: "Secure checkout process optimization."
          },
          {
            name: "Inventory",
            startDate: "2023-05-01",
            endDate: "2023-08-01",
            url: "https://portfolio.com/projects/inventory",
            image: "https://example.com/images/inventory.jpg",
            smallDescription: "Inventory management system."
          },
          {
            name: "Analytics",
            startDate: "2023-07-01",
            endDate: "2023-11-01",
            url: "https://portfolio.com/projects/analytics",
            image: "https://example.com/images/analytics.jpg",
            smallDescription: "Data analytics dashboard for sales."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 4,
        projects: [
          {
            name: "News",
            startDate: "2023-01-15",
            endDate: "2023-04-15",
            url: "https://portfolio.com/projects/news",
            image: "https://example.com/images/news.jpg",
            smallDescription: "News aggregation website with mobile view."
          },
          {
            name: "Forum",
            startDate: "2023-03-15",
            endDate: "2023-06-15",
            url: "https://portfolio.com/projects/forum",
            image: "https://example.com/images/forum.jpg",
            smallDescription: "Community forum platform."
          },
          {
            name: "E-Learning",
            startDate: "2023-05-01",
            endDate: "2023-09-01",
            url: "https://portfolio.com/projects/e-learning",
            image: "https://example.com/images/e-learning.jpg",
            smallDescription: "Online course management site."
          },
          {
            name: "CMS",
            startDate: "2023-08-01",
            endDate: "2023-12-01",
            url: "https://portfolio.com/projects/cms",
            image: "https://example.com/images/cms.jpg",
            smallDescription: "Content management system with user roles."
          }
        ]
      }
    ]
  },
  {
    category: "2024",
    value: 12,
    subData: [
      {
        category: "Android Development",
        value: 4,
        projects: [
          {
            name: "Health",
            startDate: "2024-01-01",
            endDate: "2024-05-01",
            url: "https://portfolio.com/projects/health",
            image: "https://example.com/images/health.jpg",
            smallDescription: "Health monitoring Android app with wearables integration."
          },
          {
            name: "Chat",
            startDate: "2024-02-01",
            endDate: "2024-06-01",
            url: "https://portfolio.com/projects/chat",
            image: "https://example.com/images/chat.jpg",
            smallDescription: "Secure chat application for teams."
          },
          {
            name: "Payment",
            startDate: "2024-04-01",
            endDate: "2024-08-01",
            url: "https://portfolio.com/projects/payment",
            image: "https://example.com/images/payment.jpg",
            smallDescription: "Mobile payment gateway app."
          },
          {
            name: "AR",
            startDate: "2024-07-01",
            endDate: "2024-12-01",
            url: "https://portfolio.com/projects/ar",
            image: "https://example.com/images/ar.jpg",
            smallDescription: "Augmented reality experience for retail."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 3,
        projects: [
          {
            name: "Admin",
            startDate: "2024-01-15",
            endDate: "2024-04-15",
            url: "https://portfolio.com/projects/admin",
            image: "https://example.com/images/admin.jpg",
            smallDescription: "Advanced admin panel for e-commerce operations."
          },
          {
            name: "Subscription",
            startDate: "2024-03-15",
            endDate: "2024-07-15",
            url: "https://portfolio.com/projects/subscription",
            image: "https://example.com/images/subscription.jpg",
            smallDescription: "Subscription management portal."
          },
          {
            name: "Affiliate",
            startDate: "2024-06-01",
            endDate: "2024-10-01",
            url: "https://portfolio.com/projects/affiliate",
            image: "https://example.com/images/affiliate.jpg",
            smallDescription: "Affiliate marketing tracking site."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 5,
        projects: [
          {
            name: "AI Dash",
            startDate: "2024-01-01",
            endDate: "2024-03-01",
            url: "https://portfolio.com/projects/ai-dash",
            image: "https://example.com/images/ai-dash.jpg",
            smallDescription: "AI-powered dashboard for data visualization."
          },
          {
            name: "Event",
            startDate: "2024-02-01",
            endDate: "2024-05-01",
            url: "https://portfolio.com/projects/event",
            image: "https://example.com/images/event.jpg",
            smallDescription: "Event management website."
          },
          {
            name: "Portfolio",
            startDate: "2024-04-01",
            endDate: "2024-07-01",
            url: "https://portfolio.com/projects/portfolio",
            image: "https://example.com/images/portfolio.jpg",
            smallDescription: "Dynamic portfolio builder."
          },
          {
            name: "Blog",
            startDate: "2024-05-01",
            endDate: "2024-08-01",
            url: "https://portfolio.com/projects/blog",
            image: "https://example.com/images/blog.jpg",
            smallDescription: "AI-assisted blogging platform."
          },
          {
            name: "Landing",
            startDate: "2024-09-01",
            endDate: "2024-12-01",
            url: "https://portfolio.com/projects/landing",
            image: "https://example.com/images/landing.jpg",
            smallDescription: "Optimized landing pages for campaigns."
          }
        ]
      }
    ]
  },
  {
    category: "2025",
    value: 4,
    subData: [
      {
        category: "Android Development",
        value: 1,
        projects: [
          {
            name: "IoT App",
            startDate: "2025-01-01",
            endDate: "2025-06-30",
            url: "https://portfolio.com/projects/iot-app",
            image: "https://example.com/images/iot-app.jpg",
            smallDescription: "IoT device control app with smart home integration."
          }
        ]
      },
      {
        category: "Ecommerce Website",
        value: 2,
        projects: [
          {
            name: "Global Shop",
            startDate: "2025-02-01",
            endDate: "2025-07-01",
            url: "https://portfolio.com/projects/global-shop",
            image: "https://example.com/images/global-shop.jpg",
            smallDescription: "International e-commerce site with multi-currency support."
          },
          {
            name: "B2B Portal",
            startDate: "2025-04-01",
            endDate: "2025-09-01",
            url: "https://portfolio.com/projects/b2b-portal",
            image: "https://example.com/images/b2b-portal.jpg",
            smallDescription: "B2B procurement portal."
          }
        ]
      },
      {
        category: "Website (Mobile Compatible)",
        value: 1,
        projects: [
          {
            name: "AI Web",
            startDate: "2025-03-01",
            endDate: "2025-12-17",
            url: "https://portfolio.com/projects/ai-web",
            image: "https://example.com/images/ai-web.jpg",
            smallDescription: "AI-driven web application for personalized experiences."
          }
        ]
      }
    ]
  }
];

/* -------------------- COMPONENT -------------------- */
export default function ProjectShowcaseChart() {
  const [selectedYear, setSelectedYear] = useState("2025");
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.horizontalLayout,
      })
    );
    const colors = [
      "#124e78",
      "#d0b49f",
      "#69140e",
      "#00cecb",
      "#606c38",
      "#ccd5ae",
      "#ff6d00",
      "#e9c46a",
      "#0052e0",
      "#f28482",
    ];
    /* ---------- MAIN PIE ---------- */
    const chart = container.children.push(
      am5percent.PieChart.new(root, {
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value} projects",
        }),
      })
    );
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
        colors: am5.ColorSet.new(root, { colors: colors.map((c) => am5.color(c)) }),
      })
    );
    series.labels.template.setAll({
      textType: "circular",
      radius: 6,
      fontSize: 12,
      fill: am5.color(0x000000),
      fontWeight: "600",
      text: "[fontSize:12 bold]{value}[/][fontSize:10] ({category})[/]",
    });
    series.slices.template.setAll({
      toggleKey: "none",
      cursorOverStyle: "pointer",
      tooltipText: "{category}: {value} projects",
    });
    series.slices.template.states.create("hover", {
      scale: 1.04,
    });
    series.ticks.template.set("visible", false);
    /* ---------- SUB PIE ---------- */
    const subChart = container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(55),
        tooltip: am5.Tooltip.new(root, {
          labelText:
            "[bold]{category}[/]\nProjects: {value}\n\n{projectInfo}",
          maxWidth: 260,
          multiline: true,
        }),
      })
    );
    const subSeries = subChart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        colors: am5.ColorSet.new(root, { colors: colors.map((c) => am5.color(c)) }),
      })
    );
    subSeries.data.setAll(
      new Array(7).fill(0).map((_, i) => ({
        category: `Item ${i + 1}`,
        value: 0,
        projectInfo: "",
      }))
    );
    subSeries.labels.template.setAll({
      textType: "circular",
      radius: 6,
      fontSize: 9,
      fill: am5.color(0x000000),
      text: "{category}: {value}",
    });
    subSeries.ticks.template.set("visible", false);
    subSeries.slices.template.set("toggleKey", "none");
    /* ---------- LINES ---------- */
    const line0 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [3, 3],
        strokeOpacity: 0.5,
      })
    );
    const line1 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [3, 3],
        strokeOpacity: 0.5,
      })
    );
    let selectedSlice: am5percent.PieSlice | undefined;
    function updateLines() {
      if (!selectedSlice || subSeries.slices.length === 0) return;
      const startAngle = selectedSlice.get("startAngle");
      const arc = selectedSlice.get("arc");
      const radius = selectedSlice.get("radius");
      const x00 = radius * am5.math.cos(startAngle);
      const y00 = radius * am5.math.sin(startAngle);
      const x10 = radius * am5.math.cos(startAngle + arc);
      const y10 = radius * am5.math.sin(startAngle + arc);
      const subRadius = subSeries.slices.getIndex(0)?.get("radius") || 0;
      const point00 = series.toGlobal({ x: x00, y: y00 });
      const point10 = series.toGlobal({ x: x10, y: y10 });
      const point01 = subSeries.toGlobal({ x: 0, y: -subRadius });
      const point11 = subSeries.toGlobal({ x: 0, y: subRadius });
      line0.set("points", [point00, point01]);
      line1.set("points", [point10, point11]);
    }
    function selectSlice(slice: am5percent.PieSlice) {
      selectedSlice = slice;
      const ctx = slice.dataItem?.dataContext as any;
      if (!ctx) return;
      setSelectedYear(ctx.category);
      subSeries.data.each((_, i) => {
        const sub = ctx.subData?.[i];
        if (sub && sub.projects) {
          const projectInfo = sub.projects.map(p =>
            `${p.name}[/]`
          ).join('\n');
          const subWithInfo = { ...sub, projectInfo };
          subSeries.dataItems[i]?.show();
          subSeries.data.setIndex(i, subWithInfo);
        } else {
          subSeries.dataItems[i]?.hide();
        }
      });
      const middleAngle =
        slice.get("startAngle") + slice.get("arc") / 2;
      const firstSlice = series.dataItems[0]?.get("slice");
      if (!firstSlice) return;
      const firstAngle = firstSlice.get("startAngle");
      series.animate({
        key: "startAngle",
        to: firstAngle - middleAngle,
        duration: 800,
        easing: am5.ease.out(am5.ease.cubic),
      });
      series.animate({
        key: "endAngle",
        to: firstAngle - middleAngle + 360,
        duration: 800,
        easing: am5.ease.out(am5.ease.cubic),
      });
    }
    series.slices.template.events.on("click", (e) =>
      selectSlice(e.target)
    );
    series.on("startAngle", updateLines);
    container.events.on("boundschanged", () =>
      root.events.once("frameended", updateLines)
    );
    series.data.setAll(chartData);
    series.events.on("datavalidated", () => {
      const last = series.slices.getIndex(series.slices.length - 1);
      if (last) selectSlice(last);
    });
    container.appear(800, 20);
    return () => {
      root.dispose();
    };
  }, []);
  return (
    <Card className="w-full bg-white dark:bg-gray-900 shadow-xl border-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xl font-bold">
          <span>Projects by Year</span>
          <span className="text-sm text-muted-foreground">
            Selected: {selectedYear}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          id="chartdiv"
          className="w-full h-[520px] rounded-xl dark:from-gray-800 dark:to-gray-700"
        />
      </CardContent>
    </Card>
  );
}