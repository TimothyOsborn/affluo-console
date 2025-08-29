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
import { apiService } from '../services/apiService';
import { Form, RootStackParamList } from '../types/navigation';

type FormsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FormsList'>;

const FormsListScreen: React.FC = () => {
  const navigation = useNavigation<FormsListScreenNavigationProp>();
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      apiService.setToken(token);
    }
    loadForms();
  }, [token]);

  const loadForms = async () => {
    if (!user?.companyId) return;

    try {
      setLoading(true);
      const formsData = await apiService.getForms(user.companyId);
      setForms(formsData.filter(form => form.status === 'PUBLISHED'));
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadForms();
    setRefreshing(false);
  };

  const renderFormItem = ({ item }: { item: Form }) => (
    <TouchableOpacity
      style={styles.formCard}
      onPress={() => navigation.navigate('FormFiller', {
        formId: item.id,
        formName: item.name,
      })}
    >
      <Text style={styles.formTitle}>{item.name}</Text>
      <Text style={styles.formDescription}>{item.description}</Text>
      <Text style={styles.formFields}>{item.fields.length} fields</Text>
    </TouchableOpacity>
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
    formCard: {
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
    formTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    formDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    formFields: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
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

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.content}
        data={forms}
        renderItem={renderFormItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No forms available</Text>
        }
      />
    </View>
  );
};

export default FormsListScreen;
