<template>
  <div>
    <div v-if="loading" class="py-20 text-center">
      <svg class="animate-spin w-8 h-8 text-[#C41230] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-[#718096] text-sm">Cargando servicios...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="service in services"
        :key="service.title"
        class="group bg-white rounded-2xl border border-gray-100 hover:border-[#C41230]/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <div class="h-1 bg-gradient-to-r from-[#C41230] to-[#C9A84C] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        <div class="p-8">
          <div class="text-5xl mb-5">{{ service.icon }}</div>
          <h2 class="font-bold text-[#1A1A1A] text-xl mb-4 group-hover:text-[#C41230] transition-colors">
            {{ service.title }}
          </h2>
          <p class="text-[#4A5568] text-sm leading-relaxed mb-6">{{ service.description }}</p>
          <ul class="space-y-2">
            <li
              v-for="f in service.features"
              :key="f"
              class="flex items-start gap-2 text-sm text-[#4A5568]"
            >
              <svg class="w-4 h-4 text-[#C41230] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchServices } from '../../lib/api';

type Card = { icon: string; title: string; description: string; features: string[] };

const iconMap: Record<string, string> = {
  package: '📦', factory: '🏭', truck: '🚛', chart: '📊',
  pickaxe: '⛏', microscope: '🔬', globe: '🌐', default: '🏗',
};

const fallback: Card[] = [
  { icon: '📦', title: 'Comercio Mayorista de Minerales', description: 'Especialistas en la comercialización al por mayor de minerales con los más altos estándares de calidad.', features: ['Plata, Estaño, Zinc, Plomo, Antimonio', 'Certificación de pureza y calidad', 'Contratos a largo plazo', 'Precios competitivos referenciados al LME'] },
  { icon: '🏭', title: 'Suministro para Industrias', description: 'Abastecimiento continuo y confiable de materias primas minerales para procesos industriales.', features: ['Entregas programadas y puntuales', 'Especificaciones técnicas personalizadas', 'Gestión de stock mínimo garantizado', 'Soporte técnico especializado'] },
  { icon: '🚛', title: 'Logística Minera', description: 'Gestión integral de transporte y logística con infraestructura especializada para el manejo seguro de minerales.', features: ['Transporte especializado para minerales', 'Almacenamiento técnico certificado', 'Seguimiento en tiempo real', 'Cobertura nacional'] },
  { icon: '📊', title: 'Asesoramiento Comercial', description: 'Consultoría especializada en mercados internacionales de minerales y precios de referencia LME.', features: ['Análisis de precios LME en tiempo real', 'Estrategias de cobertura de riesgo', 'Negociación internacional', 'Informes de mercado periódicos'] },
  { icon: '⛏', title: 'Desarrollo de Proyectos Mineros', description: 'Acompañamos el desarrollo de proyectos mineros desde la prospección hasta la producción.', features: ['Estudios de factibilidad', 'Gestión de permisos ambientales', 'Ingeniería de proyectos', 'Financiamiento y estructuración'] },
  { icon: '🔬', title: 'Control de Calidad', description: 'Análisis y certificación de calidad mineral conforme a estándares internacionales.', features: ['Análisis químico completo', 'Certificados de calidad internacionales', 'Muestreo y caracterización', 'Trazabilidad completa del mineral'] },
  { icon: '🌐', title: 'Gestión de Exportaciones', description: 'Tramitación completa para exportaciones: certificados de origen, permisos y documentación aduanera.', features: ['Certificados de origen', 'Gestión aduanera integral', 'Coordinación con compradores internacionales', 'Documentación INCOTERMS'] },
];

const loading = ref(true);
const services = ref<Card[]>(fallback);

onMounted(async () => {
  const apiServices = await fetchServices();
  if (apiServices.length > 0) {
    services.value = apiServices.map((s) => ({
      icon: iconMap[s.icon] ?? s.icon ?? iconMap.default,
      title: s.title,
      description: s.description,
      features: Array.isArray((s as { features?: string[] }).features)
        ? (s as { features: string[] }).features
        : [],
    }));
  }
  loading.value = false;
});
</script>
