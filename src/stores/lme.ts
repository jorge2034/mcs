import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchLME } from '../lib/api';
import type { LMEPrice } from '../types';

export const useLMEStore = defineStore('lme', () => {
  const prices = ref<LMEPrice[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const search = ref('');
  const sortKey = ref<keyof LMEPrice>('metal');
  const sortDir = ref<'asc' | 'desc'>('asc');

  const filtered = computed(() => {
    let list = prices.value.filter(p =>
      p.metal.toLowerCase().includes(search.value.toLowerCase()) ||
      p.symbol.toLowerCase().includes(search.value.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      const va = a[sortKey.value] as string | number;
      const vb = b[sortKey.value] as string | number;
      if (va < vb) return sortDir.value === 'asc' ? -1 : 1;
      if (va > vb) return sortDir.value === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  });

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      prices.value = await fetchLME();
    } catch {
      error.value = 'Error al cargar precios LME';
    } finally {
      loading.value = false;
    }
  }

  function setSort(key: keyof LMEPrice) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortDir.value = 'asc';
    }
  }

  return { prices, loading, error, search, sortKey, sortDir, filtered, load, setSort };
});
