<template>
  <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
    <h3 class="text-white font-bold text-xl mb-6">Envíenos un mensaje</h3>

    <div v-if="success" class="bg-green-500/20 border border-green-500/40 rounded-xl p-5 text-center mb-6">
      <svg class="w-10 h-10 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-white font-semibold">{{ successMsg }}</p>
      <p class="text-white/60 text-sm mt-1">Nos pondremos en contacto a la brevedad.</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            Nombre completo *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Juan Pérez"
            class="w-full bg-white/10 border border-white/20 focus:border-[#C41230] text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label class="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            Empresa
          </label>
          <input
            v-model="form.company"
            type="text"
            placeholder="Su empresa"
            class="w-full bg-white/10 border border-white/20 focus:border-[#C41230] text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            Email *
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="juan@empresa.com"
            class="w-full bg-white/10 border border-white/20 focus:border-[#C41230] text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label class="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            Teléfono
          </label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="+591 70000000"
            class="w-full bg-white/10 border border-white/20 focus:border-[#C41230] text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label class="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
          Asunto *
        </label>
        <select
          v-model="form.subject"
          required
          class="w-full bg-white/10 border border-white/20 focus:border-[#C41230] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
        >
          <option value="" class="bg-[#1A1A1A]">Seleccione un asunto</option>
          <option value="cotizacion" class="bg-[#1A1A1A]">Solicitar cotización</option>
          <option value="servicios" class="bg-[#1A1A1A]">Consulta sobre servicios</option>
          <option value="minerales" class="bg-[#1A1A1A]">Información sobre minerales</option>
          <option value="proyectos" class="bg-[#1A1A1A]">Desarrollo de proyectos</option>
          <option value="otro" class="bg-[#1A1A1A]">Otro</option>
        </select>
      </div>

      <div>
        <label class="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
          Mensaje *
        </label>
        <textarea
          v-model="form.message"
          required
          rows="5"
          placeholder="Describa su consulta o necesidad..."
          class="w-full bg-white/10 border border-white/20 focus:border-[#C41230] text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
        ></textarea>
      </div>

      <div v-if="errorMsg" class="bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-red-300 text-sm">
        {{ errorMsg }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-[#C41230] hover:bg-[#E8193F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
      >
        <span v-if="loading">
          <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </span>
        <span v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </span>
        {{ loading ? 'Enviando...' : 'Enviar Mensaje' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { submitContact } from '../../lib/api';

const loading = ref(false);
const success = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const form = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});

async function handleSubmit() {
  loading.value = true;
  errorMsg.value = '';
  const res = await submitContact(form);
  loading.value = false;
  if (res.success) {
    success.value = true;
    successMsg.value = res.message;
  } else {
    errorMsg.value = res.message;
  }
}
</script>
