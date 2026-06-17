import { useBackgroundTimer } from './hooks/useBackgroundTimer';
import { useTranslation } from 'react-i18next'; // 1. Import useTranslation
import './LevelBadge.css';

function LevelBadge() {
    const { level: currentLevel, levelProgress } = useBackgroundTimer();
    const { t } = useTranslation(); // Initialize translation hook

    // Ensure we have a numeric level; default to 0 otherwise
    const level = Number.isFinite(currentLevel) ? currentLevel : 0;
    const currentBadgeClass = `level-badge-${level} level-badge`;

  return (
    <>
      {/* Level Badge - Translated */}
      <div className={currentBadgeClass}>
        <div className="flex-row">
          <span>{t('level')}: </span><span>{level}</span>
        </div>
        <div className="level-progress-bar">
          {/* key={level} forces remount on level change, resetting width to 0 instantly */}
          <div key={level} className="progress-fill" style={{ width: `${levelProgress}%` }}></div>
        </div>
      </div>
    </>
  );
}

export default LevelBadge;