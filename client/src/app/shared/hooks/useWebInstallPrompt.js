import { useState, useEffect } from 'react';
import useShouldShowPrompt from './useShouldShowPrompt';

const webInstallPromptedAt = 'webInstallPromptedAt';

const useWebInstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState();
  const [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt] = useShouldShowPrompt(webInstallPromptedAt);

  useEffect(() => {
    // console.log('useShoulbe Instlal')
    const beforeInstallPromptHandler = event => {
        console.log('before Instlal')
      event.preventDefault();

      // check if user has already been asked
      if (userShouldBePromptedToInstall) {
        console.log('useShoulbe Instlal')
        // store the event for later use
        setInstallPromptEvent(event);
      }
      else
      {
        console.log('usedont Instlal')
      }
    };
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    return () => window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
  }, [userShouldBePromptedToInstall]);

  const handleInstallDeclined = () => {
    handleUserSeeingInstallPrompt();
    setInstallPromptEvent(null);
  };

  const handleInstallAccepted = () => {
    // show native prompt
    installPromptEvent.prompt();

    // decide what to do after the user chooses
    installPromptEvent.userChoice.then(choice => {
      // if the user declined, we don't want to show the prompt again
      if (choice.outcome !== 'accepted') {
        handleUserSeeingInstallPrompt();
      }
      setInstallPromptEvent(null);
    });
  };
  return [installPromptEvent, handleInstallDeclined, handleInstallAccepted];
};
export default useWebInstallPrompt;