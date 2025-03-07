# Fresh Home - 海鲜生鲜配送应用

## 项目概述

Fresh Home 是一款专注于优质海鲜生鲜配送的移动应用。本应用基于 Expo 框架开发，采用现代化的UI设计和流畅的用户体验，为用户提供便捷的海鲜生鲜购物服务。

## 核心功能

### 1. 首页功能
- 地址选择：支持多地址管理和切换
- 轮播展示：展示促销活动和主打商品
- 商品分类：直观的分类导航系统
- 特价商品：展示当前促销商品
- 热门商品：展示最受欢迎的商品

### 2. 商品详情
- 商品展示：大图展示商品
- 价格信息：显示原价、优惠价和折扣信息
- 商品规格：详细的商品规格信息
- 营养信息：包含营养成分数据
- 加入购物车：快捷的购物功能

### 3. 用户体验
- 下拉刷新：支持页面内容刷新
- 平滑动画：包含页面切换和模态框动画
- 欢迎页面：优雅的应用启动体验

## 项目结构

```
fresh_home_expo/
├── app/                    # 主应用目录
│   ├── (tabs)/            # 标签页面
│   │   ├── index.tsx      # 首页
│   │   ├── categories.tsx # 分类页
│   │   ├── orders.tsx     # 订单页
│   │   └── profile.tsx    # 个人中心
│   ├── product/           # 商品相关页面
│   │   └── [id].tsx       # 商品详情页
│   └── index.tsx          # 欢迎页面
├── components/            # 组件目录
│   ├── home/             # 首页相关组件
│   │   ├── HomeHeader.tsx    # 首页头部
│   │   ├── CarouselBanner.tsx# 轮播图
│   │   ├── CategorySection.tsx# 分类区域
│   │   ├── OnSaleProducts.tsx# 特价商品
│   │   └── PopularProducts.tsx# 热门商品
│   └── common/           # 通用组件
│       └── RefreshableScrollView.tsx # 可刷新滚动视图
```

## 主要依赖

- expo-router: 用于应用导航和路由管理
- expo-status-bar: 状态栏管理
- @expo/vector-icons: 图标库
- react-native: 基础框架
- react-native-reanimated: 动画效果支持

## 启动项目

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npx expo start
```

## 注意事项

1. 本项目使用 Expo 托管工作流，确保开发环境已正确配置
2. 商品数据目前使用模拟数据，后续需要接入实际API
3. 图片资源使用 Unsplash 链接，建议后续迁移到专门的图片服务

## 贡献指南

1. 遵循项目既定的代码风格和组件结构
2. 新功能开发请在相应目录下创建组件
3. 保持代码的可维护性和可读性
4. 添加适当的中文注释

## 联系方式

如有问题或建议，请通过以下方式联系：
[待补充]
