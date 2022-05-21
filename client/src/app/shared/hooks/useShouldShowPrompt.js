import { useState } from 'react';
// import moment from 'moment';

const getInstallPromptLastSeenAt = (promptName) => localStorage.getItem(promptName);

const setInstallPromptSeenToday = (promptName) => {
  const d = new Date();
  const today = d.toISOString();
  localStorage.setItem(promptName, today);
};

const getUserShouldBePromptedToInstall = (promptName, daysToWaitBeforePromptingAgain) => 
{
    const d = new Date();
  const lastPrompt = new Date(getInstallPromptLastSeenAt(promptName));
//   const daysSinceLastPrompt = moment().diff(lastPrompt, 'days');
  const daysSinceLastPrompt = (d.getTime()-lastPrompt.getTime())/(1000*3600*24);

  return Number.isNaN(daysSinceLastPrompt) || daysSinceLastPrompt > daysToWaitBeforePromptingAgain;
}

const useShouldShowPrompt = (promptName, daysToWaitBeforePromptingAgain = 2) => {
  const [userShouldBePromptedToInstall, setUserShouldBePromptedToInstall] = useState(
    getUserShouldBePromptedToInstall(promptName, daysToWaitBeforePromptingAgain)
  );
  
  const handleUserSeeingInstallPrompt = () => {
    setUserShouldBePromptedToInstall(false);
    setInstallPromptSeenToday(promptName);
  };

  return [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt];
};
export default useShouldShowPrompt;