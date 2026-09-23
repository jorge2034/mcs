<template>
  <div>
    <div v-if="loading" class="py-20 text-center">
      <svg class="animate-spin w-8 h-8 text-[#C41230] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-[#718096] text-sm">Cargando minerales...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="m in minerals"
        :key="m.symbol"
        class="group rounded-2xl border border-gray-100 hover:border-[#C41230]/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <div class="p-8">
          <div class="flex items-start gap-5 mb-5">
            <div
              class="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xl shrink-0"
              :class="m.color"
            >
              {{ m.symbol }}
            </div>
            <div>
              <h2 class="font-display text-2xl font-bold text-[#1A1A1A] group-hover:text-[#C41230] transition-colors">{{ m.name }}</h2>
              <span v-if="m.stat" class="text-xs font-semibold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">{{ m.stat }}</span>
            </div>
          </div>
          <p class="text-[#4A5568] text-sm leading-relaxed mb-5">{{ m.desc }}</p>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-[#F8F8F8] rounded-xl p-4">
              <div class="text-xs font-bold text-[#718096] uppercase tracking-widest mb-2">Pureza / Ley</div>
              <div class="font-semibold text-[#1A1A1A] text-sm">{{ m.purity }}</div>
            </div>
            <div class="bg-[#F8F8F8] rounded-xl p-4">
              <div class="text-xs font-bold text-[#718096] uppercase tracking-widest mb-2">Presentaciones</div>
              <div class="text-[#1A1A1A] text-xs">{{ m.form.join(' · ') }}</div>
            </div>
          </div>

          <div class="mt-4">
            <div class="text-xs font-bold text-[#718096] uppercase tracking-widest mb-2">Principales usos</div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="u in m.uses"
                :key="u"
                class="text-xs bg-[#C41230]/8 text-[#C41230] px-2.5 py-1 rounded-full"
              >{{ u }}</span>
            </div>
          </div>
        </div>
        <div class="px-8 pb-6">
          <a
            href="/contacto"
            class="inline-flex items-center gap-2 text-sm font-semibold text-[#C41230] hover:text-[#E8193F] transition-colors"
          >
            Solicitar cotización
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchMinerals } from '../../lib/api';

type Card = {
  symbol: string;
  name: string;
  color: string;
  purity: string;
  form: string[];
  uses: string[];
  desc: string;
  stat: string;
};

const colorMap: Record<string, string> = {
  Ag: 'from-slate-300 to-slate-500', Sn: 'from-zinc-300 to-zinc-500',
  Zn: 'from-blue-300 to-blue-500', Pb: 'from-gray-400 to-gray-600',
  Sb: 'from-orange-300 to-orange-500',
  W: 'from-stone-400 to-stone-600', Cu: 'from-orange-400 to-red-500',
};

const fallback: Card[] = [
  { symbol: 'Ag', name: 'Plata', color: 'from-slate-300 to-slate-500', purity: '95-99.9%', form: ['Concentrado', 'Barras', 'Granulado'], uses: ['Joyería y orfebrería', 'Industria electrónica', 'Fotografía', 'Medicina', 'Energía solar'], desc: 'La plata es uno de los metales más valiosos de Bolivia. El país posee importantes yacimientos en Potosí y Oruro.', stat: 'Bolivia: 5to productor mundial' },
  { symbol: 'Sn', name: 'Estaño', color: 'from-zinc-300 to-zinc-500', purity: '99.85%+', form: ['Lingotes', 'Granulado', 'Polvo'], uses: ['Soldadura electrónica', 'Hojalata', 'Bronce y latón', 'Química industrial', 'Energías renovables'], desc: 'Bolivia es uno de los principales productores de estaño del mundo. Reconocido por su pureza excepcional.', stat: 'Bolivia: 5to productor mundial' },
  { symbol: 'Zn', name: 'Zinc', color: 'from-blue-300 to-blue-500', purity: '50-55% (concentrado)', form: ['Concentrado', 'Lingotes', 'Polvo'], uses: ['Galvanización de acero', 'Aleaciones metálicas', 'Pinturas y pigmentos', 'Agricultura', 'Farmacéutica'], desc: 'El zinc es fundamental para la industria siderúrgica y de galvanización.', stat: 'Bolivia: 8vo productor mundial' },
  { symbol: 'Pb', name: 'Plomo', color: 'from-gray-400 to-gray-600', purity: '45-70% (concentrado)', form: ['Concentrado', 'Lingotes'], uses: ['Baterías de plomo-ácido', 'Construcción', 'Municiones', 'Protección radiológica', 'Industria química'], desc: 'El plomo boliviano tiene alta demanda en la industria de baterías y construcción.', stat: 'Bolivia: importante reserva regional' },
  { symbol: 'Sb', name: 'Antimonio', color: 'from-orange-300 to-orange-500', purity: '60%+ (concentrado)', form: ['Concentrado', 'Trióxido', 'Metal'], uses: ['Retardantes de llama', 'Aleaciones de plomo', 'Semiconductores', 'Vidrio y cerámica', 'Pigmentos'], desc: 'Bolivia es el cuarto productor mundial de antimonio.', stat: 'Bolivia: 4to productor mundial' },
  { symbol: 'W', name: 'Wolfram', color: 'from-stone-400 to-stone-600', purity: 'Variable', form: ['Scheelita', 'Wolframita', 'Polvo'], uses: ['Herramientas de corte', 'Filamentos', 'Aceros especiales', 'Industria aeroespacial', 'Medicina nuclear'], desc: 'El wolfram boliviano se encuentra principalmente en yacimientos del departamento de La Paz.', stat: 'Reservas significativas en La Paz' },
  { symbol: 'Cu', name: 'Cobre', color: 'from-orange-400 to-red-500', purity: '25-35% (concentrado)', form: ['Concentrado', 'Cátodos', 'Alambrón'], uses: ['Industria eléctrica', 'Construcción', 'Telecomunicaciones', 'Maquinaria industrial', 'Vehículos eléctricos'], desc: 'El cobre es el metal más demandado en la era de la electrificación.', stat: 'Reservas en exploración activa' },
];

const loading = ref(true);
const minerals = ref<Card[]>(fallback);

onMounted(async () => {
  const apiMinerals = await fetchMinerals();
  if (apiMinerals.length > 0) {
    minerals.value = apiMinerals.filter((m) => m.symbol !== 'Au').map((m) => ({
      symbol: m.symbol,
      name: m.name,
      color: colorMap[m.symbol] ?? 'from-gray-300 to-gray-500',
      purity: (m as { purity?: string }).purity ?? '—',
      form: Array.isArray((m as { forms?: string[] }).forms) ? (m as { forms: string[] }).forms : [],
      uses: Array.isArray(m.uses) ? m.uses : [],
      desc: m.description,
      stat: (m as { stat?: string }).stat ?? '',
    }));
  }
  loading.value = false;
});
</script>
