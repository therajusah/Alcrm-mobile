import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ShimmerProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const shimmerColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colors.surfaceSecondary || '#f0f0f0',
      colors.border || '#e0e0e0',
    ],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: shimmerColor,
        },
        style,
      ]}
    />
  );
};

// Pre-built shimmer components for common UI patterns
export const ShimmerCard: React.FC<{ style?: any }> = ({ style }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      <Shimmer width={60} height={60} borderRadius={30} />
      <View style={styles.cardContent}>
        <Shimmer width="70%" height={16} style={{ marginBottom: 8 }} />
        <Shimmer width="50%" height={14} style={{ marginBottom: 12 }} />
        <Shimmer width="100%" height={12} style={{ marginBottom: 4 }} />
        <Shimmer width="80%" height={12} />
      </View>
    </View>
  );
};

export const ShimmerJobCard: React.FC<{ style?: any }> = ({ style }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.jobCard, { backgroundColor: colors.surface }, style]}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Shimmer width="80%" height={18} style={{ marginBottom: 8 }} />
          <Shimmer width="60%" height={14} style={{ marginBottom: 12 }} />
        </View>
        <Shimmer width={60} height={20} borderRadius={10} />
      </View>
      
      <View style={styles.jobDetails}>
        <Shimmer width="40%" height={12} style={{ marginBottom: 8 }} />
        <Shimmer width="30%" height={12} style={{ marginBottom: 8 }} />
        <Shimmer width="50%" height={12} />
      </View>
      
      <View style={styles.jobDescription}>
        <Shimmer width="100%" height={12} style={{ marginBottom: 4 }} />
        <Shimmer width="90%" height={12} style={{ marginBottom: 4 }} />
        <Shimmer width="70%" height={12} />
      </View>
    </View>
  );
};

export const ShimmerMentorCard: React.FC<{ style?: any }> = ({ style }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.mentorCard, { backgroundColor: colors.surface }, style]}>
      <View style={styles.mentorHeader}>
        <Shimmer width={60} height={60} borderRadius={30} />
        <View style={styles.mentorInfo}>
          <Shimmer width="70%" height={18} style={{ marginBottom: 6 }} />
          <Shimmer width="50%" height={14} style={{ marginBottom: 4 }} />
          <Shimmer width="40%" height={12} />
        </View>
      </View>
      
      <View style={styles.mentorMeta}>
        <Shimmer width="40%" height={14} style={{ marginRight: 16 }} />
        <Shimmer width="30%" height={14} />
      </View>
      
      <View style={styles.mentorDescription}>
        <Shimmer width="100%" height={12} style={{ marginBottom: 4 }} />
        <Shimmer width="85%" height={12} style={{ marginBottom: 4 }} />
        <Shimmer width="60%" height={12} />
      </View>
      
      <View style={styles.mentorActions}>
        <Shimmer width={100} height={36} borderRadius={8} style={{ marginRight: 12 }} />
        <Shimmer width={80} height={36} borderRadius={8} />
      </View>
    </View>
  );
};

export const ShimmerSessionCard: React.FC<{ style?: any }> = ({ style }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.sessionCard, { backgroundColor: colors.surface }, style]}>
      <View style={styles.sessionHeader}>
        <Shimmer width={50} height={50} borderRadius={25} />
        <View style={styles.sessionInfo}>
          <Shimmer width="60%" height={17} style={{ marginBottom: 4 }} />
          <Shimmer width="40%" height={13} style={{ marginBottom: 4 }} />
          <Shimmer width="50%" height={14} />
        </View>
        <Shimmer width={70} height={24} borderRadius={12} />
      </View>
      
      <View style={styles.sessionDivider} />
      
      <View style={styles.sessionDetails}>
        <View style={styles.detailRow}>
          <Shimmer width="30%" height={14} />
          <Shimmer width="40%" height={14} />
        </View>
        <View style={styles.detailRow}>
          <Shimmer width="25%" height={14} />
          <Shimmer width="35%" height={14} />
        </View>
      </View>
      
      <View style={styles.sessionActions}>
        <Shimmer width="100%" height={44} borderRadius={10} style={{ marginBottom: 8 }} />
        <Shimmer width="60%" height={44} borderRadius={10} />
      </View>
    </View>
  );
};

export const ShimmerList: React.FC<{
  count?: number;
  itemHeight?: number;
  style?: any;
}> = ({ count = 5, itemHeight = 120, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerCard
          key={index}
          style={{ marginBottom: 16, height: itemHeight }}
        />
      ))}
    </View>
  );
};

export const ShimmerJobList: React.FC<{
  count?: number;
  style?: any;
}> = ({ count = 5, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerJobCard
          key={index}
          style={{ marginBottom: 16 }}
        />
      ))}
    </View>
  );
};

export const ShimmerMentorList: React.FC<{
  count?: number;
  style?: any;
}> = ({ count = 5, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerMentorCard
          key={index}
          style={{ marginBottom: 16 }}
        />
      ))}
    </View>
  );
};

export const ShimmerSessionList: React.FC<{
  count?: number;
  style?: any;
}> = ({ count = 5, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerSessionCard
          key={index}
          style={{ marginBottom: 16 }}
        />
      ))}
    </View>
  );
};

// Full screen shimmer for initial loading
export const ShimmerScreen: React.FC<{
  type?: 'dashboard' | 'jobs' | 'mentors' | 'sessions' | 'profile' | 'resources' | 'applications' | 'generic';
  style?: any;
}> = ({ type = 'generic', style }) => {
  const { colors } = useTheme();
  
  const renderContent = () => {
    switch (type) {
      case 'dashboard':
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            {/* Header Section */}
            <View style={styles.dashboardHeader}>
              <Shimmer width="70%" height={28} style={{ marginBottom: 8 }} />
              <Shimmer width="85%" height={16} />
            </View>
            
            {/* Quick Actions Section */}
            <View style={styles.quickActionsSection}>
              <Shimmer width="40%" height={20} style={{ marginBottom: 16 }} />
              <View style={styles.quickActionsGrid}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <View key={index} style={styles.quickActionCard}>
                    <Shimmer width={36} height={36} borderRadius={18} style={{ marginBottom: 12 }} />
                    <Shimmer width="90%" height={14} />
                  </View>
                ))}
              </View>
            </View>
            
            {/* Recent Jobs Section */}
            <View style={styles.recentJobsSection}>
              <View style={styles.sectionHeader}>
                <Shimmer width="50%" height={20} />
                <Shimmer width={60} height={16} />
              </View>
              <ShimmerJobList count={3} />
            </View>
          </View>
        );
        
      case 'jobs':
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            {/* Search Bar */}
            <View style={styles.jobsSearchContainer}>
              <Shimmer width="100%" height={44} borderRadius={8} />
            </View>
            
            {/* Jobs List */}
            <View style={styles.jobsContent}>
              <ShimmerJobList count={8} />
            </View>
          </View>
        );
        
      case 'mentors':
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            {/* Search Bar */}
            <View style={styles.mentorsSearchContainer}>
              <Shimmer width="100%" height={44} borderRadius={8} style={{ marginBottom: 12 }} />
              {/* Domain Filters */}
              <View style={styles.domainFiltersContainer}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Shimmer key={index} width={80} height={32} borderRadius={16} style={{ marginRight: 8, marginBottom: 8 }} />
                ))}
              </View>
            </View>
            
            {/* Mentors List */}
            <View style={styles.mentorsContent}>
              <ShimmerMentorList count={6} />
            </View>
          </View>
        );
        
      case 'sessions':
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            {/* Filter Chips */}
            <View style={styles.sessionsFilterContainer}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Shimmer key={index} width={80} height={32} borderRadius={16} style={{ marginRight: 8, marginBottom: 8 }} />
              ))}
            </View>
            
            {/* Sessions List */}
            <View style={styles.sessionsContent}>
              <ShimmerSessionList count={5} />
            </View>
          </View>
        );
        
      case 'profile':
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <Shimmer width={100} height={100} borderRadius={50} style={{ marginBottom: 16 }} />
              <Shimmer width="60%" height={24} style={{ marginBottom: 8 }} />
              <Shimmer width="40%" height={16} style={{ marginBottom: 24 }} />
            </View>
            
            {/* Profile Sections */}
            <View style={styles.profileSections}>
              <ShimmerList count={4} />
            </View>
          </View>
        );
        
      case 'resources':
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            {/* Resources List */}
            <View style={styles.resourcesContent}>
              <ShimmerList count={8} />
            </View>
          </View>
        );
        
      case 'applications':
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            {/* Applications List */}
            <View style={styles.applicationsContent}>
              <ShimmerList count={6} />
            </View>
          </View>
        );
        
      default:
        return (
          <View style={[styles.screenContainer, { backgroundColor: colors.background }, style]}>
            <ShimmerList count={6} />
          </View>
        );
    }
  };

  return renderContent();
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  jobCard: {
    padding: 20,
    borderRadius: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobDescription: {
    marginTop: 8,
  },
  mentorCard: {
    padding: 20,
    borderRadius: 12,
  },
  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mentorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mentorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mentorDescription: {
    marginBottom: 12,
  },
  mentorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionCard: {
    padding: 20,
    borderRadius: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sessionDivider: {
    height: 1,
    marginVertical: 16,
  },
  sessionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionActions: {
    marginTop: 16,
  },
  screenContainer: {
    flex: 1,
  },
  
  // Dashboard specific styles
  dashboardHeader: {
    backgroundColor: '#6B46C1', // Primary color for header background
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 16,
  },
  quickActionCard: {
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 120,
  },
  recentJobsSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Jobs specific styles
  jobsSearchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  jobsContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  // Mentors specific styles
  mentorsSearchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  domainFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mentorsContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  // Sessions specific styles
  sessionsFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  sessionsContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  // Profile specific styles
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  profileSections: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  // Resources specific styles
  resourcesContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  // Applications specific styles
  applicationsContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});

export default Shimmer;
