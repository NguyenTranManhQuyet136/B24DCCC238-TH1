import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Typography } from 'antd';
import './index.less';

const { Title } = Typography;

// =============================================
// Dữ liệu mẫu cho Profile Card
// =============================================
interface ProfileData {
  name: string;
  avatar: string;
  description: string;
  role: string;
  email: string;
  phone: string;
  skills: string[];
}

const profiles: ProfileData[] = [
  {
    name: 'Nguyễn Văn A',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    description:
      'Sinh viên ngành Công nghệ thông tin tại Học viện Công nghệ Bưu chính Viễn thông. Đam mê lập trình web và phát triển ứng dụng di động.',
    role: 'Frontend Developer',
    email: 'nguyenvana@ptit.edu.vn',
    phone: '0123 456 789',
    skills: ['React', 'TypeScript', 'Node.js', 'CSS'],
  },
  {
    name: 'Trần Thị B',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    description:
      'Kỹ sư phần mềm với hơn 3 năm kinh nghiệm. Chuyên về thiết kế UI/UX và phát triển giao diện người dùng hiện đại.',
    role: 'UI/UX Designer',
    email: 'tranthib@ptit.edu.vn',
    phone: '0987 654 321',
    skills: ['Figma', 'Adobe XD', 'HTML/CSS', 'JavaScript'],
  },
  {
    name: 'Lê Hoàng C',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
    description:
      'Nghiên cứu sinh chuyên ngành Trí tuệ nhân tạo. Yêu thích machine learning, deep learning và xử lý ngôn ngữ tự nhiên.',
    role: 'AI Researcher',
    email: 'lehoangc@ptit.edu.vn',
    phone: '0369 852 147',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
  },
];

// =============================================
// Component ProfileCard
// =============================================
const ProfileCard: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  // Sử dụng react-responsive để xác định kích thước màn hình
  const isDesktop = useMediaQuery({ minWidth: 769 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className={`profile-card ${isDesktop ? 'profile-card--horizontal' : 'profile-card--vertical'}`}>
      {/* Phần ảnh đại diện */}
      <div className="profile-card__avatar-section">
        <div className="profile-card__avatar-wrapper">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="profile-card__avatar"
          />
        </div>
        {/* Chỉ hiển thị trên mobile: Badge nhỏ dưới ảnh */}
        {isMobile && (
          <span className="profile-card__mobile-badge">
            📱 Mobile View
          </span>
        )}
      </div>

      {/* Phần thông tin */}
      <div className="profile-card__info-section">
        <h2 className="profile-card__name">{profile.name}</h2>
        <span className="profile-card__role">{profile.role}</span>
        <p className="profile-card__description">{profile.description}</p>

        {/* Desktop: Hiển thị thông tin liên hệ chi tiết */}
        {isDesktop && (
          <div className="profile-card__contact-details">
            <div className="profile-card__contact-item">
              <span className="profile-card__contact-icon">📧</span>
              <span>{profile.email}</span>
            </div>
            <div className="profile-card__contact-item">
              <span className="profile-card__contact-icon">📞</span>
              <span>{profile.phone}</span>
            </div>
          </div>
        )}

        {/* Hiển thị danh sách kỹ năng */}
        <div className="profile-card__skills">
          {profile.skills.map((skill) => (
            <span key={skill} className="profile-card__skill-tag">
              {skill}
            </span>
          ))}
        </div>

        {/* Mobile: Hiển thị nút nhắn tin nhanh thay vì thông tin chi tiết */}
        {isMobile && (
          <div className="profile-card__mobile-actions">
            <button className="profile-card__action-btn profile-card__action-btn--primary">
              💬 Nhắn tin
            </button>
            <button className="profile-card__action-btn profile-card__action-btn--secondary">
              📞 Gọi điện
            </button>
          </div>
        )}

        {/* Desktop: Hiển thị nút chi tiết */}
        {isDesktop && (
          <div className="profile-card__desktop-actions">
            <button className="profile-card__action-btn profile-card__action-btn--primary">
              Xem hồ sơ đầy đủ
            </button>
            <button className="profile-card__action-btn profile-card__action-btn--secondary">
              Gửi lời mời kết bạn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================
// Trang chính hiển thị danh sách ProfileCard
// =============================================
const ProfileCardPage: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 769 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="profile-page">
      {/* Tiêu đề trang */}
      <div className="profile-page__header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          🎴 Profile Card Responsive
        </Title>
        <p className="profile-page__subtitle">
          Bài tập: Xây dựng trang Profile Card Responsive sử dụng CSS + react-responsive
        </p>
        {/* Hiển thị badge cho biết đang ở chế độ nào */}
        <div className="profile-page__device-badge">
          {isDesktop ? '🖥️ Desktop Mode' : '📱 Mobile Mode'}
        </div>
      </div>

      {/* Phần giải thích */}
      <div className="profile-page__info-box">
        <strong>📌 Hướng dẫn:</strong> Thu nhỏ trình duyệt xuống dưới 768px để xem giao diện mobile.
        <br />
        • <strong>Desktop (&gt; 768px):</strong> Card ngang – ảnh bên trái, thông tin bên phải.
        <br />
        • <strong>Mobile (≤ 768px):</strong> Card dọc – ảnh trên, thông tin dưới.
        <br />
        • Sử dụng <code>react-responsive</code> để hiển thị nội dung khác nhau (contact details vs action buttons).
      </div>

      {/* Danh sách Profile Card */}
      <div className="profile-page__cards">
        {profiles.map((profile) => (
          <ProfileCard key={profile.email} profile={profile} />
        ))}
      </div>

      {/* Footer */}
      <div className="profile-page__footer">
        Bài tập Thực hành – B24DCCC238 – Học viện Công nghệ Bưu chính Viễn thông
      </div>
    </div>
  );
};

export default ProfileCardPage;
