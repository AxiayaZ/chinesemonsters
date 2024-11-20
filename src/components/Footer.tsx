import React from 'react';
import { Mail, Phone, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 关于我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">关于我们</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              中国妖怪百科致力于收集、整理和展示中国传统文化中的妖怪故事，
              让更多人了解这些蕴含丰富文化内涵的民间传说。
            </p>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">联系方式</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>contact@monster-encyclopedia.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>+86 123-4567-8900</span>
              </div>
            </div>
          </div>

          {/* 更多链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">更多链接</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Github className="w-4 h-4" />
                <a href="#" className="hover:text-white transition-colors duration-200">
                  项目源码
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Twitter className="w-4 h-4" />
                <a href="#" className="hover:text-white transition-colors duration-200">
                  关注我们
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2024 中国妖怪百科 版权所有</p>
          <p className="mt-1">
            本网站内容仅供学习研究使用，请勿用于商业用途
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;