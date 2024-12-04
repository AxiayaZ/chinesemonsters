import React from 'react';
import { Github, Mail } from 'lucide-react';

// Define team member type
interface TeamMember {
  name: string;
  position: string;
  monsterId: string;
  contact: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'CAO Bohan',
    position: 'Humanities Specialist',
    monsterId: '361-540',
    contact: '24095474G@connect.polyu.hk'
  },
  {
    name: 'CHEN Hongyu',
    position: 'Software Engineer',
    monsterId: '181-360',
    contact: '24121458G@connect.polyu.hk'
  },
  {
    name: 'HUANG Jiawei',
    position: 'Software Engineer',
    monsterId: '1-180',
    contact: '24126408G@connect.polyu.hk'
  },
  {
    name: 'YANG Peilin',
    position: 'Humanities Specialist',
    monsterId: '541-720',
    contact: '24124939G@connect.polyu.hk'
  },
  {
    name: 'MENG Yuan',
    position: 'Project Manager',
    monsterId: '721-900',
    contact: '24124053G@connect.polyu.hk'
  },
  {
    name: 'WU Zhen',
    position: 'Data Analyst',
    monsterId: '901-1071',
    contact: '24138226G@connect.polyu.hk'
  }
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">关于我们</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              中国妖怪百科致力于收集、整理和展示中国传统文化中的妖怪故事，
              让更多人了解这些蕴含丰富文化内涵的民间传说。<br />
              本网站所有妖怪信息和分类依据都参考自《中国妖怪故事》 (张云著)，仅供学习和交流使用。
              <br />
              图片均来自网络，如有侵权，请联系删除。
            </p>
          </div>

          {/* Project Team */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-white">项目成员</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 pr-4 text-gray-300 font-medium">Name</th>
                    <th className="text-left py-2 pr-4 text-gray-300 font-medium">Position</th>
                    <th className="text-left py-2 pr-4 text-gray-300 font-medium">Monster ID</th>
                    <th className="text-left py-2 text-gray-300 font-medium">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member, index) => (
                    <tr 
                      key={member.contact}
                      className={index !== teamMembers.length - 1 ? 'border-b border-gray-800' : ''}
                    >
                      <td className="py-2 pr-4">{member.name}</td>
                      <td className="py-2 pr-4">{member.position}</td>
                      <td className="py-2 pr-4">{member.monsterId}</td>
                      <td className="py-2">
                        <a 
                          href={`mailto:${member.contact}`}
                          className="hover:text-white transition-colors duration-200 flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span className="text-xs">{member.contact}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Links and Course Information */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <a 
                href="https://github.com/AxiayaZ/chinesemonsters" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                Source Code
              </a>
            </div>
            <div className="text-center text-gray-400 text-sm">
              <p>The Hong Kong Polytechnic University</p>
              <p className="mt-1">DIGITAL STUDIES OF CHINESE CULTURE</p>
              <p className="mt-1 flex items-center justify-center gap-1">
                Instructor: Dr. Jing CHEN 
                <a 
                  href="mailto:jing-jc.chen@polyu.edu.hk"
                  className="hover:text-white transition-colors duration-200 flex items-center gap-1 ml-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>jing-jc.chen@polyu.edu.hk</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;