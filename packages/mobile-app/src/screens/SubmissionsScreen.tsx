import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSync } from '../contexts/SyncContext';
import { apiService } from '../services/apiService';
import { FormSubmission, RootStackParamList } from '../types/navigation';

type SubmissionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Submissions'>;

const SubmissionsScreen: React.FC = () => {
  const navigation = useNavigation<SubmissionsScreenNavigationProp>();
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const { pendingSubmissions } = useSync();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      apiService.setToken(token);
    }
    loadSubmissions();
  }, [token]);

  const loadSubmissions = async () => {
    if (!user?.companyId) return;

    try {
      setLoading(true);
      const submissionsData = await apiService.getSubmissions(user.companyId);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return theme.colors.success;
      case 'REJECTED':
        return theme.colors.error;
      case 'PENDING':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderSubmissionItem = ({ item }: { item: FormSubmission }) => (
    <View style={styles.submissionCard}>
      <View style={styles.submissionHeader}>
        <Text style={styles.submissionId}>#{item.id.slice(-8)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.submissionDate}>
        Submitted: {formatDate(item.submittedAt)}
      </Text>
      <Text style={styles.submissionBy}>By: {item.submittedBy}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    submissionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    submissionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    submissionId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    statusText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: 'bold',
    },
    submissionDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    submissionBy: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    pendingSection: {
      marginBottom: theme.spacing.lg,
    },
    pendingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: 16,
      marginTop: theme.spacing.xl,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const allSubmissions = [...pendingSubmissions, ...submissions];

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.content}
        data={allSubmissions}
        renderItem={renderSubmissionItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No submissions found</Text>
        }
      />
    </View>
  );
};

export default SubmissionsScreen;
