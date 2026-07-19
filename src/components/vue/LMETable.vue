<template>
  <div>
    <!-- Header controls -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span class="text-[#4A5568] text-sm font-medium">
          {{ store.prices.length > 0 ? `${store.prices.length} metales` : 'Cargando...' }}
        </span>
        <span v-if="lastUpdate" class="text-[#718096] text-xs">— Actualizado: {{ lastUpdate }}</span>
      </div>
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="store.search"
          type="text"
          placeholder="Buscar metal..."
          class="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C41230] w-56"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="py-20 text-center">
      <svg class="animate-spin w-8 h-8 text-[#C41230] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-[#718096] text-sm">Cargando precios LME...</p>
    </div>

    <!-- No data fallback / demo data -->
    <div v-else>
      <!-- Summary cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div
          v-for="item in displayPrices.slice(0, 6)"
          :key="item.metal"
          class="bg-[#F8F8F8] hover:bg-white rounded-xl p-4 border border-transparent hover:border-gray-200 hover:shadow-md transition-all group cursor-default"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="w-9 h-9 rounded-lg bg-[#1A1A1A] text-white text-xs font-black flex items-center justify-center">
              {{ item.symbol }}
            </span>
            <span
              :class="[
                'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                item.changePercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]"
            >
              {{ item.changePercent >= 0 ? '▲' : '▼' }} {{ Math.abs(item.changePercent).toFixed(2) }}%
            </span>
          </div>
          <div class="text-[#1A1A1A] font-black text-base leading-none mb-1 group-hover:text-[#C41230] transition-colors">
            {{ item.price.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
          <div class="text-[#718096] text-xs font-medium">{{ item.metal }}</div>
          <div class="text-[#718096] text-[10px]">{{ item.currency }}</div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[#1A1A1A] text-white">
              <th
                v-for="col in columns"
                :key="col.key"
                @click="store.setSort(col.key)"
                class="px-5 py-4 text-left font-semibold text-xs uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors select-none"
              >
                <div class="flex items-center gap-1">
                  {{ col.label }}
                  <span class="text-white/30">
                    <span v-if="store.sortKey === col.key">
                      {{ store.sortDir === 'asc' ? '↑' : '↓' }}
                    </span>
                    <span v-else>↕</span>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in displayPrices"
              :key="item.metal"
              :class="['border-b border-gray-50 hover:bg-[#F8F8F8] transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]']"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <span class="w-9 h-9 rounded-lg bg-[#1A1A1A] text-white text-xs font-black flex items-center justify-center shrink-0">
                    {{ item.symbol }}
                  </span>
                  <span class="font-semibold text-[#1A1A1A]">{{ item.metal }}</span>
                </div>
              </td>
              <td class="px-5 py-4 font-bold text-[#1A1A1A]">
                {{ item.price.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="px-5 py-4 text-[#718096]">{{ item.currency }}</td>
              <td class="px-5 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1 font-semibold text-xs px-2.5 py-1 rounded-full',
                    item.changePercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ item.changePercent >= 0 ? '▲' : '▼' }}
                  {{ Math.abs(item.changePercent).toFixed(2) }}%
                </span>
              </td>
              <td class="px-5 py-4">
                <span
                  :class="[
                    'text-xs font-medium',
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}
                </span>
              </td>
              <td class="px-5 py-4 text-[#718096] text-xs">{{ item.date }}</td>
              <td class="px-5 py-4 text-[#718096] text-xs">{{ item.time }}</td>
            </tr>
            <tr v-if="displayPrices.length === 0">
              <td colspan="7" class="px-5 py-12 text-center text-[#718096] text-sm">
                No se encontraron resultados para "{{ store.search }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[#718096] text-xs mt-4 text-center">
        * Precios de referencia LME. Actualización periódica por el equipo comercial.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useLMEStore } from '../../stores/lme';

const store = useLMEStore();

// Demo data shown when API is unavailable
const demoData = [
  { symbol: 'Cu', metal: 'Cobre', price: 9847.50, currency: 'USD/t', change: 121.25, changePercent: 1.23, date: '2026-06-30', time: '16:30' },
  { symbol: 'Al', metal: 'Aluminio', price: 2432.00, currency: 'USD/t', change: -10.95, changePercent: -0.45, date: '2026-06-30', time: '16:30' },
  { symbol: 'Zn', metal: 'Zinc', price: 2891.75, currency: 'USD/t', change: 59.70, changePercent: 2.10, date: '2026-06-30', time: '16:30' },
  { symbol: 'Pb', metal: 'Plomo', price: 2105.50, currency: 'USD/t', change: -38.50, changePercent: -1.80, date: '2026-06-30', time: '16:30' },
  { symbol: 'Sn', metal: 'Estaño', price: 27850.00, currency: 'USD/t', change: 241.29, changePercent: 0.87, date: '2026-06-30', time: '16:30' },
  { symbol: 'Ag', metal: 'Plata', price: 30.45, currency: 'USD/oz', change: 0.95, changePercent: 3.20, date: '2026-06-30', time: '16:30' },
  { symbol: 'Au', metal: 'Oro', price: 2340.80, currency: 'USD/oz', change: 15.20, changePercent: 0.65, date: '2026-06-30', time: '16:30' },
  { symbol: 'Ni', metal: 'Níquel', price: 16780.00, currency: 'USD/t', change: -120.00, changePercent: -0.71, date: '2026-06-30', time: '16:30' },
  { symbol: 'Sb', metal: 'Antimonio', price: 17500.00, currency: 'USD/t', change: 350.00, changePercent: 2.04, date: '2026-06-30', time: '16:30' },
];

const displayPrices = computed(() => {
  const prices = store.prices.length > 0 ? store.filtered : demoData;
  if (store.search && store.prices.length === 0) {
    return demoData.filter(p =>
      p.metal.toLowerCase().includes(store.search.toLowerCase()) ||
      p.symbol.toLowerCase().includes(store.search.toLowerCase())
    );
  }
  return prices;
});

const lastUpdate = computed(() => {
  const data = store.prices.length > 0 ? store.prices : demoData;
  return data[0]?.date ?? null;
});

const columns = [
  { key: 'metal', label: 'Metal' },
  { key: 'price', label: 'Precio' },
  { key: 'currency', label: 'Moneda' },
  { key: 'changePercent', label: 'Variación %' },
  { key: 'change', label: 'Cambio' },
  { key: 'date', label: 'Fecha' },
  { key: 'time', label: 'Hora' },
] as const;

onMounted(() => {
  store.load();
});
</script>
