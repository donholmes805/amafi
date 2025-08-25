
import React, { useState, useEffect } from 'react';
import { AMA, Role, User, UserTier } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AMARoom from './components/AMARoom';
import HostDashboard from './components/HostDashboard';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import ModeratorDashboard from './components/ModeratorDashboard';
import CalendarPage from './components/CalendarPage';
import UpdatePasswordPage from './components/UpdatePasswordPage';
import AMAHighlightsPage from './components/AMAHighlightsPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ManageAMAPage from './components/ManageAMAPage';
import api from './services/api';
import { processAMA } from './utils/data';

const App: React.FC = () => {
  type View = 'auth' | 'landing' | 'room' | 'dashboard' | 'profile' | 'admin' | 'moderator' | 'calendar' | 'updatePassword' | 'highlights' | 'terms' | 'privacy' | 'manageAMA';

  const [view, setView] = useState<View>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedAMA, setSelectedAMA] = useState<AMA | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [amas, setAmas] = useState<AMA[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialAuthRole, setInitialAuthRole] = useState<Role>(Role.VIEWER);

  useEffect(() => {
    // Check if a user session exists
    const checkUserSession = async () => {
      setLoading(true);
      const user = await api.checkAuth();
      setCurrentUser(user);
      await fetchAllData();
      setLoading(false);
    };

    checkUserSession();
  }, []);

  const fetchAllData = async () => {
    try {
        const [amasData, usersData] = await Promise.all([
          api.fetchAmas(),
          api.fetchUsers(),
        ]);
        setAmas((amasData || []).map(processAMA));
        setUsers(usersData || []);
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
        // Optionally set an error state to show a message to the user
    }
  };


  useEffect(() => {
    // Dynamically load PayPal SDK if the VITE_PAYPAL_CLIENT_ID is set
    const paypalClientId = api.getPaypalClientId();
    if (paypalClientId) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&vault=true`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
            document.body.removeChild(script);
        }
      }
    } else {
        console.warn("PayPal Client ID is not configured. PayPal buttons will not render.");
    }
  }, []);

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setView('landing');
  }

  const handleLogout = (nextView: View = 'landing') => {
    api.logout();
    setCurrentUser(null);
    setInitialAuthRole(Role.VIEWER);
    setView(nextView);
  };
  
  const navigateToRoom = (ama: AMA) => {
    setSelectedAMA(ama);
    setView('room');
  };

  const navigateToDashboard = () => {
    setSelectedAMA(null);
    if (currentUser?.role === Role.HOST || currentUser?.role === Role.ADMIN || currentUser?.role === Role.MODERATOR) {
      setView('dashboard');
    } else {
      setView('landing');
    }
  };

  const navigateToAdmin = () => {
    if (currentUser?.role === Role.ADMIN) {
        setView('admin');
    }
  };

  const navigateToModerator = () => {
    if (currentUser?.role === Role.ADMIN || currentUser?.role === Role.MODERATOR) {
        setView('moderator');
    }
  };
  
  const navigateToProfile = (user: User) => {
    setSelectedProfile(user);
    setView('profile');
  };
  
  const navigateToManageAMA = (ama: AMA) => {
    setSelectedAMA(ama);
    setView('manageAMA');
  };

  const navigateToCalendar = () => {
    setView('calendar');
  };
  
  const navigateToHighlights = (ama: AMA) => {
    setSelectedAMA(ama);
    setView('highlights');
  };
  
  const navigateToTerms = () => setView('terms');
  const navigateToPrivacy = () => setView('privacy');

  const navigateHome = () => {
    setSelectedAMA(null);
    setSelectedProfile(null);
    setInitialAuthRole(Role.VIEWER);
    setView('landing');
  };

  const handleUpgradeToHost = async () => {
    if (!currentUser) {
        alert("You must be logged in to do this.");
        return;
    };
    
    if (window.confirm("This will upgrade your account to a Host account, allowing you to create and manage your own AMAs. Do you want to proceed?")) {
        const updatedUser = await api.upgradeToHost(currentUser.id);
        if (updatedUser) {
          alert("Congratulations! Your account has been upgraded to a Host account.");
          setCurrentUser(updatedUser);
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          setView('dashboard');
        } else {
          alert("Failed to upgrade account. Please try again.");
        }
    }
  }

  const handleNavigateToCreateAMA = () => {
    if (currentUser) {
      if (currentUser.role === Role.HOST || currentUser.role === Role.ADMIN || currentUser.role === Role.MODERATOR) {
        setView('dashboard');
      } else if (currentUser.role === Role.VIEWER) {
        handleUpgradeToHost();
      } else {
        alert(`Your current role (${currentUser.role}) does not permit creating AMAs.`);
      }
    } else {
      setInitialAuthRole(Role.HOST);
      setView('auth');
    }
  };
  
  const handleFollowToggle = async (hostId: string) => {
    if (!currentUser) {
        alert("Please log in to follow hosts.");
        setView('auth');
        return;
    }

    const updatedUser = await api.toggleFollow(currentUser.id, hostId);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    } else {
      alert("Could not update follow status. Please try again.");
    }
  };

  const handleCreateAMA = async (newAMAData: Omit<AMA, 'id' | 'viewers' | 'startTime' | 'youtubeUrls' | 'host'>) => {
     if (!currentUser) {
        alert("You must be logged in to create an AMA.");
        return;
     }
     const newAMA = await api.createAma(newAMAData);
     if (newAMA) {
       alert(`Successfully created AMA: ${newAMA.title}`);
       const processedAMA = processAMA(newAMA);
       setAmas([processedAMA, ...amas]);
       setView('dashboard');
     } else {
       alert("Error creating AMA.");
     }
  };

  const handleUpdateAMA = async (updatedData: Partial<AMA>) => {
     if (!updatedData.id) {
        alert("Cannot update AMA without an ID.");
        return;
     }
     const updatedAMA = await api.updateAma(updatedData.id, updatedData);
     if(updatedAMA) {
        alert(`Successfully updated AMA: ${updatedAMA.title}`);
        const processedAMA = processAMA(updatedAMA);
        setAmas(amas.map(a => a.id === processedAMA.id ? processedAMA : a));
        navigateToDashboard();
     } else {
        alert(`Error updating AMA.`);
     }
  };
  
  const handleDeleteAMA = async (amaId: number) => {
    const success = await api.deleteAma(amaId);
    if (success) {
      alert('AMA successfully deleted.');
      setAmas(amas.filter(a => a.id !== amaId));
      navigateToDashboard();
    } else {
      alert('Error deleting AMA.');
    }
  };


  const handleFeatureAMA = async (amaId: string) => {
    const numericAmaId = parseInt(amaId, 10);
    const updatedAMA = await api.featureAma(numericAmaId);
    if (updatedAMA) {
      alert("AMA has been featured!");
      const processedAMA = processAMA(updatedAMA);
      setAmas(amas.map(a => a.id === processedAMA.id ? processedAMA : a));
    } else {
      alert("Error featuring AMA.");
    }
  };
  
  const handleUpdateUser = async (userId: string, updates: Partial<Pick<User, 'role' | 'tier'>>): Promise<User | null> => {
    const updatedUser = await api.updateUser(userId, updates);
    if(updatedUser) {
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      if(currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } else {
      alert("Error updating user.");
      return null;
    }
  };

  const handleUpgradeToPremium = async (userToUpgrade: User) => {
    const updatedUser = await api.updateUser(userToUpgrade.id, { tier: 'PREMIUM' });
    if (updatedUser) {
        alert(`Congratulations, ${updatedUser.name}! You are now a Premium Host.`);
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    } else {
       alert('Error upgrading to premium.');
    }
  };

  const handleUpdateAvatar = async (newAvatarUrl: string) => {
    if (!currentUser) return;
    const updatedUser = await api.updateUser(currentUser.id, { avatar_url: newAvatarUrl });
    if (updatedUser) {
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      alert("Profile picture updated successfully!");
    } else {
      alert("Could not update your profile picture. Please try again.");
    }
  };
  
  const handleUpdateBio = async (newBio: string) => {
    if (!currentUser) return;
    const updatedUser = await api.updateUser(currentUser.id, { bio: newBio });
    if (updatedUser) {
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    } else {
      alert("Could not update your bio. Please try again.");
    }
  };
  
  const handleUpdateWalletInfo = async (walletTicker: string, walletAddress: string) => {
     if (!currentUser) return;
     const updatedUser = await api.updateUser(currentUser.id, { wallet_ticker: walletTicker, wallet_address: walletAddress });
     if (updatedUser) {
       setCurrentUser(updatedUser);
       setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
       alert("Wallet information updated successfully!");
     } else {
       alert("Could not update your wallet information. Please try again.");
     }
  };

  const handleAmaInteraction = async (amaId: number, type: 'like' | 'dislike') => {
    const updatedAMA = await api.updateAmaInteraction(amaId, type);
    if (updatedAMA) {
      const processedAMA = processAMA(updatedAMA);
      setAmas(amas.map(a => a.id === amaId ? processedAMA : a));
      if (selectedAMA?.id === amaId) {
        setSelectedAMA(processedAMA);
      }
    } else {
      alert(`Could not save your ${type}. Please try again.`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-10">Loading...</div>
    }
    switch (view) {
      case 'auth':
        return <AuthPage onAuthSuccess={handleLoginSuccess} initialRole={initialAuthRole} />;
      case 'room':
        return selectedAMA && <AMARoom ama={selectedAMA} currentUser={currentUser} onExit={navigateHome} onSelectUser={navigateToProfile} onPromptLogin={() => setView('auth')} onNavigateToHighlights={navigateToHighlights} onAmaInteraction={handleAmaInteraction} />;
      case 'dashboard': {
        const canHost = currentUser && [Role.HOST, Role.ADMIN, Role.MODERATOR].includes(currentUser.role);
        if (canHost) {
          return <HostDashboard host={currentUser!} amas={amas.filter(a => a.host.id === currentUser?.id)} onCreateAMA={handleCreateAMA} onUpgradeToPremium={() => handleUpgradeToPremium(currentUser!)} onExit={navigateHome} onManageAMA={navigateToManageAMA} />;
        }
        return <LandingPage amas={amas} currentUser={currentUser} onSelectAMA={navigateToRoom} onSelectUser={navigateToProfile} onNavigateToHighlights={navigateToHighlights} onCreateAMA={handleNavigateToCreateAMA} />;
      }
      case 'admin':
        return currentUser?.role === Role.ADMIN
          ? <AdminDashboard currentUser={currentUser} users={users} amas={amas} onUpdateUser={handleUpdateUser} onFeatureAMA={handleFeatureAMA} />
          : <LandingPage amas={amas} currentUser={currentUser} onSelectAMA={navigateToRoom} onSelectUser={navigateToProfile} onNavigateToHighlights={navigateToHighlights} onCreateAMA={handleNavigateToCreateAMA} />;
      case 'moderator':
        return (currentUser?.role === Role.ADMIN || currentUser?.role === Role.MODERATOR)
          ? <ModeratorDashboard users={users} amas={amas} />
          : <LandingPage amas={amas} currentUser={currentUser} onSelectAMA={navigateToRoom} onSelectUser={navigateToProfile} onNavigateToHighlights={navigateToHighlights} onCreateAMA={handleNavigateToCreateAMA} />;
      case 'profile':
        return selectedProfile && <ProfilePage user={selectedProfile} currentUser={currentUser} amas={amas} onSelectAMA={navigateToRoom} onFollowToggle={handleFollowToggle} onUpdateAvatar={handleUpdateAvatar} onUpdateBio={handleUpdateBio} onUpdateWalletInfo={handleUpdateWalletInfo} onExit={navigateHome} />;
      case 'calendar':
        return <CalendarPage amas={amas} onSelectAMA={navigateToRoom} onExit={navigateHome} />;
       case 'updatePassword':
        return <UpdatePasswordPage onUpdateSuccess={navigateHome} />;
       case 'highlights':
        return selectedAMA && <AMAHighlightsPage ama={selectedAMA} onExit={navigateHome} />;
       case 'manageAMA':
        return selectedAMA && currentUser && (
            <ManageAMAPage 
                ama={selectedAMA}
                onUpdateAMA={handleUpdateAMA}
                onDeleteAMA={handleDeleteAMA}
                onExit={navigateToDashboard}
            />
        );
       case 'terms':
        return <TermsOfServicePage onExit={navigateHome} />;
       case 'privacy':
        return <PrivacyPolicyPage onExit={navigateHome} />;
      case 'landing':
      default:
        return <LandingPage amas={amas} currentUser={currentUser} onSelectAMA={navigateToRoom} onSelectUser={navigateToProfile} onNavigateToHighlights={navigateToHighlights} onCreateAMA={handleNavigateToCreateAMA} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Header 
        user={currentUser} 
        onNavigateHome={navigateHome} 
        onNavigateToDashboard={navigateToDashboard}
        onNavigateToAdmin={navigateToAdmin}
        onNavigateToModerator={navigateToModerator}
        onNavigateToCalendar={navigateToCalendar}
        onNavigateToProfile={() => currentUser && navigateToProfile(currentUser)}
        onLogout={() => handleLogout()}
        onSignUp={() => setView('auth')}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer onNavigateToTerms={navigateToTerms} onNavigateToPrivacy={navigateToPrivacy} />
    </div>
  );
};

export default App;