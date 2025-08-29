import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSync } from '../contexts/SyncContext';
import { apiService } from '../services/apiService';
import { Form, FormField, RootStackParamList } from '../types/navigation';

type FormFillerScreenRouteProp = RouteProp<RootStackParamList, 'FormFiller'>;
type FormFillerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FormFiller'>;

const FormFillerScreen: React.FC = () => {
  const route = useRoute<FormFillerScreenRouteProp>();
  const navigation = useNavigation<FormFillerScreenNavigationProp>();
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const { addPendingSubmission, isOnline } = useSync();
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      apiService.setToken(token);
    }
    loadForm();
  }, [token]);

  const loadForm = async () => {
    if (!user?.companyId) return;

    try {
      setLoading(true);
      const formData = await apiService.getForm(user.companyId, route.params.formId);
      setForm(formData);
    } catch (error) {
      console.error('Failed to load form:', error);
      Alert.alert('Error', 'Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!form) return false;

    for (const field of form.fields) {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        Alert.alert('Validation Error', `${field.label} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const submission = {
        formId: form!.id,
        submittedBy: user!.username,
        status: 'PENDING' as const,
        data: formData,
        metadata: {
          submittedAt: new Date().toISOString(),
          device: 'mobile',
        },
      };

      if (isOnline) {
        await apiService.submitForm(user!.companyId, submission);
        Alert.alert('Success', 'Form submitted successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        addPendingSubmission({
          ...submission,
          id: `pending_${Date.now()}`,
          submittedAt: new Date().toISOString(),
        });
        Alert.alert('Offline', 'Form saved for later submission', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      Alert.alert('Error', 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <TextInput
            style={styles.input}
            placeholder={field.placeholder || field.label}
            value={value}
            onChangeText={(text) => handleFieldChange(field.id, text)}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
          />
        );
      default:
        return (
          <TextInput
            style={styles.input}
            placeholder={field.placeholder || field.label}
            value={value}
            onChangeText={(text) => handleFieldChange(field.id, text)}
          />
        );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    formTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    formDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    fieldContainer: {
      marginBottom: theme.spacing.lg,
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    required: {
      color: theme.colors.error,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.textPrimary,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    submitButtonText: {
      color: theme.colors.surface,
      fontSize: 18,
      fontWeight: 'bold',
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textDisabled,
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

  if (!form) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.formDescription}>Form not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.formTitle}>{form.name}</Text>
        <Text style={styles.formDescription}>{form.description}</Text>

        {form.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <View key={field.id} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                {field.label}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
              {renderField(field)}
            </View>
          ))}

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Form</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FormFillerScreen;
