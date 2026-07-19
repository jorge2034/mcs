import axios from 'axios';
import type { LMEPrice, NewsItem, Service, Mineral, Client, ContactForm } from '../types';

const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  timeout: 10000,
});

export async function fetchLME(): Promise<LMEPrice[]> {
  try {
    const { data } = await api.get('/lme');
    return data.data ?? data;
  } catch {
    return [];
  }
}

export async function fetchNews(page = 1, category?: string): Promise<{ data: NewsItem[]; total: number }> {
  try {
    const params: Record<string, unknown> = { page };
    if (category) params.category = category;
    const { data } = await api.get('/news', { params });
    return data;
  } catch {
    return { data: [], total: 0 };
  }
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const { data } = await api.get(`/news/${slug}`);
    return data.data ?? data;
  } catch {
    return null;
  }
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const { data } = await api.get('/services');
    return data.data ?? data;
  } catch {
    return [];
  }
}

export async function fetchMinerals(): Promise<Mineral[]> {
  try {
    const { data } = await api.get('/minerals');
    return data.data ?? data;
  } catch {
    return [];
  }
}

export async function fetchClients(): Promise<Client[]> {
  try {
    const { data } = await api.get('/clients');
    return data.data ?? data;
  } catch {
    return [];
  }
}

export async function submitContact(form: ContactForm): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await api.post('/contact', form);
    return { success: true, message: data.message ?? 'Mensaje enviado correctamente.' };
  } catch (error: unknown) {
    const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    return { success: false, message: msg ?? 'Error al enviar el mensaje.' };
  }
}
