<template>
  <div class="text-white p-5 w-full">
    <h1 class="text-xl font-bold">
      <span class="text-green font-bold">IDOR</span> Vulnerability Calculator
    </h1>
    <div class="text-white float-right flex flex-row gap-2">
      <span
        class="text-white cursor-pointer text-opacity-50 hover:text-white hover:text-opacity-100"
        @click="showSettings = true"
      >
        <i class="fa-solid fa-gear"></i>
      </span>
      <router-link
        :to="{ name: 'idor-calculator', query: { c: directLink } }"
        class="text-white cursor-pointer text-opacity-50 hover:text-white hover:text-opacity-100"
      >
        <i class="fas fa-share ml-1"></i>
      </router-link>
    </div>

    <p class="lg:w-2/3 mt-5">
      Use the calculator to test how resistant various random identifiers are
      against bruteforce attacks. <br />
      This is applicable to
      <span
        class="text-green font-bold"
        label="Insecure Direct Object Reference"
        >IDOR</span
      >
      vulnerabilities, 2FA tokens, session tokens or generally any random value.
    </p>

    <OverlayBlock
      v-if="showSettings"
      @clickClose="() => (showSettings = false)"
    >
      <b
        ><i class="fa-solid fa-gear text-white text-opacity-50 mr-3"></i>
        Advanced Settings</b
      >
      <div class="grid grid-cols-2 content-center mt-5">
        <div class="text-sm font-medium sm:mt-px sm:pt-2 pr-10">
          Slider Max ID Length
        </div>
        <div>
          <input
            type="number"
            class="bg-darker w-full text-right rounded-md px-2 py-1"
            v-model="max_length"
          />
        </div>

        <div class="text-sm font-medium sm:mt-px sm:pt-2 pr-10">
          Certainty (<span class="text-green font-bold"
            >{{ Math.ceil(target_certainty * 100) }}%</span
          >)
        </div>
        <div class="flex items-center sm:pt-2">
          <div class="flex flex-row whitespace-nowrap">
            <span class="font-bold">1%</span>
            <input
              type="range"
              class="mx-2 accent-green w-full transition-all"
              min="0.01"
              step="0.01"
              max="1.00"
              v-model.number="target_certainty"
            />
            <span class="font-bold">100%</span>
          </div>
        </div>
        <div class="text-sm font-medium sm:mt-px sm:pt-2 pr-10">
          Start Value
        </div>
        <div class="sm:pt-2">
          <input
            type="number"
            class="bg-darker w-full text-right rounded-md px-2 py-1"
            v-model="start_value_str"
          />
        </div>
      </div>
    </OverlayBlock>

    <div>
      <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
        <div
          class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-dark sm:pt-5"
        >
          <label
            for="username"
            class="block text-sm font-medium sm:mt-px sm:pt-2"
          >
            ID of length <span class="text-green font-bold">{{ length }}</span>
          </label>
          <div class="mt-1 sm:mt-0 sm:col-span-2">
            <p class="my-2 text-sm text-gray-500">
              How long is the identifier or random value?
              <span class="text-green font-bold text-base ml-1">{{
                length
              }}</span>
            </p>
            <div class="flex flex-row whitespace-nowrap">
              <span class="font-bold">2</span>
              <input
                type="range"
                class="mx-2 accent-green w-full md:w-1/2 transition-all"
                min="2"
                step="1"
                :max="max_length"
                v-model="length"
              />
              <span class="font-bold">{{ max_length }}</span>
            </div>
          </div>
        </div>

        <div
          class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-dark sm:pt-5"
        >
          <label for="about" class="block text-sm font-medium sm:mt-px sm:pt-2">
            Alphabet with
            <span class="text-green font-bold">{{ alphabet.length }}</span>
            characters
          </label>
          <div class="mt-1 sm:mt-0 sm:col-span-2">
            <p class="my-2 text-sm text-gray-500">
              List of characters used for the identifier. You can also select a
              preset:
            </p>
            <input
              class="bg-darker px-1 mb-1 w-full font-mono text-white text-opacity-50 focus:text-opacity-100"
              type="text"
              v-model="alphabet"
              ref="alphabet_input"
              @input="
                () => {
                  alphabet = uniqueChars(alphabet);
                }
              "
            />
            <div>
              <button
                class="px-3 py-1 rounded rouned-lg m-1 border-2 hover:border-white bg-dark border-dark"
                v-for="alphabet_name in Object.keys(alphabet_preset)"
                @click="setAlphabet(alphabet_preset[alphabet_name])"
              >
                {{ alphabet_name }}
              </button>

              <button
                class="px-3 py-1 rounded rouned-lg m-1 border-2 hover:border-white bg-dark border-dark text-opacity-50"
                @click="$refs.alphabet_input.focus()"
              >
                custom
              </button>
            </div>
          </div>
        </div>

        <div
          class="sm:grid sm:grid-cols-5 sm:gap-4 sm:items-start sm:border-t sm:border-dark sm:pt-5"
        >
          <div
            class="bg-dark sm:col-span-5 md:col-start-2 md:col-end-5 rounded rounded-lg p-5"
          >
            <div>
              There are
              <span class="text-green font-bold">{{ maxNumber }}</span>
              possible IDs.
            </div>
            <div class="my-2">
              Here are some example ID values:
              <div class="my-2 flex flex-wrap max-h-12 overflow-hidden">
                <div
                  v-for="(x, i) in new Array(Math.ceil(200 / length))"
                  :key="i"
                  class="font-mono mr-2 text-white text-opacity-50"
                >
                  {{
                    dec2base(
                      start_value + randBigInt2(maxNumber - start_value)
                    ).padStart(length, alphabet[0])
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-dark sm:pt-5"
        >
          <label
            for="username"
            class="block text-sm font-medium sm:mt-px sm:pt-2"
          >
            Correct Guesses
          </label>
          <div class="mt-1 sm:mt-0 sm:col-span-2">
            <input
              class="bg-dark w-36 text-right rounded-md px-2 py-1"
              type="number"
              v-model.bigint="correct_guesses"
            />
            <p class="mt-2 text-sm text-gray-500">
              Select how many of the
              <span class="text-green font-bold">{{ maxNumber }}</span>
              possibilities actually exist and could be found.
            </p>
          </div>
        </div>

        <div
          class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-dark sm:pt-5"
        >
          <label
            for="username"
            class="block text-sm font-medium sm:mt-px sm:pt-2"
          >
            Threat Multiplier:
            <span class="text-green font-bold" v-if="threat_multiplier < 2"
              >Not Critical</span
            ><span
              class="text-yellow font-bold"
              v-else-if="threat_multiplier < 5"
              >Somewhat Critical</span
            ><span class="text-red font-bold" v-else>Very Critical</span>
          </label>
          <div class="mt-1 sm:mt-0 sm:col-span-2">
            <div class="flex flex-row whitespace-nowrap">
              <span class="text-green font-bold">Not Critical</span>
              <input
                type="range"
                class="mx-2 accent-green w-full md:w-1/2 transition-all"
                :class="{
                  'accent-green': threat_multiplier < 2,
                  'accent-yellow':
                    threat_multiplier >= 2 && threat_multiplier < 7,
                  'accent-red': threat_multiplier >= 7,
                }"
                min="0.001"
                step="0.005"
                max="10"
                v-model="threat_multiplier"
              />
              <span class="text-red font-bold">Very Critical</span>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              How critical is the data you try to access? This affects how long
              it should take an attacker to succeed (<span
                class="text-green font-bold"
                >{{
                  humanizeDuration(threshold, {
                    largest: 1,
                    round: true,
                  })
                }}</span
              >)
            </p>
          </div>
        </div>

        <div
          class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-dark sm:pt-5"
        >
          <label
            for="username"
            class="block text-sm font-medium sm:mt-px sm:pt-2"
          >
            Additional Context
          </label>
          <div class="mt-1 sm:mt-0 sm:col-span-2">
            <div class="max-w-lg space-y-4">
              <div class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="comments"
                    v-model="notify_victim"
                    name="comments"
                    type="checkbox"
                    class="focus:ring-green accent-green text-dark h-4 w-4 text-green border-dark rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="comments" class="font-medium"
                    >Victim Notification</label
                  >
                  <p class="text-gray-500">
                    Does attacking alert the victim? eg. trigger mail, SMS, ...
                  </p>
                </div>
              </div>
              <div>
                <div class="relative flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="candidates"
                      name="candidates"
                      v-model="online"
                      type="checkbox"
                      class="focus:ring-green accent-green text-dark h-4 w-4 text-green border-dark rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="candidates" class="font-medium"
                      >Online Attack</label
                    >
                    <p class="text-gray-500">
                      Is this attack done over the internet or locally?
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="relative flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      v-model="lockout"
                      class="focus:ring-green accent-green text-dark h-4 w-4 text-green border-dark rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="offers" class="font-medium">Hard Lockout</label>
                    <p class="text-gray-500">
                      System completely locked after some attempts?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 lg:sm:grid-cols-4 gap-4 sm:items-start sm:border-t sm:border-dark sm:pt-5"
        >
          <h1 class="text-lg font-bold">
            Results
            <span class="text-sm font-normal text-xs ml-2">
              <router-link
                :to="{ name: 'idor-calculator', query: { c: directLink } }"
                class="text-white cursor-pointer text-opacity-50 hover:text-white hover:text-opacity-100"
              >
                share direct link <i class="fas fa-share ml-1"></i>
              </router-link>
            </span>
          </h1>
        </div>

        <div class="sm:grid sm:grid-cols-5 sm:gap-4 sm:items-start">
          <div
            class="bg-dark sm:col-span-5 md:col-start-2 md:col-end-5 rounded rounded-lg p-5"
          >
            <div>
              To find one succesfully with
              <i>{{ Math.floor(target_certainty * 100) }}%</i> certainty ...
            </div>
            <div class="ml-4">
              <div>
                ... you need
                <span class="text-green font-bold"
                  >{{
                    binominal_distribution !== Infinity
                      ? Math.ceil(binominal_distribution)
                      : `∞`
                  }}
                  attempts</span
                >
                if every attempt is random.
                <span
                  v-if="
                    hypergeometric_distribution !== Infinity ||
                    hypergeometric_distribution < 3075840000000000
                  "
                >
                  It's impossible!
                </span>
              </div>
              <div>
                ... you need
                <span class="text-green font-bold"
                  >{{
                    hypergeometric_distribution !== Infinity
                      ? Math.ceil(hypergeometric_distribution)
                      : `∞`
                  }}
                  attempts</span
                >
                if you search in a set.
                <span
                  v-if="
                    hypergeometric_distribution !== Infinity ||
                    hypergeometric_distribution < 3075840000000000
                  "
                >
                  It's impossible!
                </span>
              </div>
            </div>
            <div class="mt-2">
              With the current threat settings it's considered "bad" when you
              succeed in under
              <span class="text-green font-bold">{{
                humanizeDuration(threshold, {
                  largest: 1,
                  round: true,
                })
              }}</span
              >.
            </div>
          </div>
        </div>

        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 lg:sm:grid-cols-4 gap-4 sm:items-start sm:pt-5"
        >
          <h1 class="text-md font-bold">Simulated Attackers</h1>
        </div>

        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 lg:sm:grid-cols-4 gap-4 sm:pt-5"
        >
          <AttackerItem
            v-if="online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :requestsPerMs="5 / 1000"
            :notify_victim="notify_victim"
            :lockout="lockout"
            name="Lazy Hacker"
            description="A simple python script"
          />
          <AttackerItem
            v-if="online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :notify_victim="notify_victim"
            :lockout="lockout"
            :requestsPerMs="200 / 1000"
            name="Script Kiddie"
            description="Hacker with an optimized script over the internet"
          />
          <AttackerItem
            v-if="online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :notify_victim="notify_victim"
            :lockout="lockout"
            :requestsPerMs="1000 / 1000"
            name="Prepared Attacker"
            description="Hacker renting server in close prxomity (same region or data center)"
          />
          <AttackerItem
            v-if="online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :notify_victim="notify_victim"
            :lockout="lockout"
            :requestsPerMs="100000 / 1000"
            name="Performance Nerd"
            description="Owning IP ranges and lots of servers"
          />

          <AttackerItem
            v-if="!online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :notify_victim="notify_victim"
            :lockout="lockout"
            :requestsPerMs="1 / 10000"
            name="Opportunistic Thief"
            description="A thief who performs some attempts by hand"
          />
          <AttackerItem
            v-if="!online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :notify_victim="notify_victim"
            :lockout="lockout"
            :requestsPerMs="2 / 1000"
            name="Automation"
            description="Device that automatically tests inputs"
          />
          <AttackerItem
            v-if="!online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :notify_victim="notify_victim"
            :lockout="lockout"
            :requestsPerMs="10000 / 1000"
            name="Hardware Hacker"
            description="Specialized tooling and parallelism"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import factorial from "bigint-factorial";
import humanizeDuration from "humanize-duration";
import slider from "vue3-slider";
import AttackerItem from "../components/AttackerItem.vue";
import OverlayBlock from "../components/OverlayBlock.vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useIdorStore } from "@/stores/IdorStore";

export default defineComponent({
  props: {},
  setup(props) {
    const store = useIdorStore();
    const route = useRoute();
    const showTab = ref(1);
    const showSettings = ref(false);

    const {
      length,
      max_length,
      nr_requests,
      notify_victim,
      online,
      alphabet,
      start_value_str,
      correct_guesses,
      target_certainty,
      threat_multiplier,
      lockout,
    } = storeToRefs(store);
    console.log("value: " + alphabet.value);

    console.log(route.query);

    if (route.query?.c?.toString()?.length) {
      const preset = JSON.parse(atob(route.query?.c.toString()));
      length.value = Number(preset.l) || length.value;
      max_length.value = Number(preset.ml) || max_length.value;
      nr_requests.value = Number(preset.r) || nr_requests.value;
      notify_victim.value = Boolean(preset.n) || notify_victim.value;
      online.value = Boolean(preset.o) || online.value;
      alphabet.value = preset.a?.toString() || alphabet.value;
      start_value_str.value = preset.s?.toString() || start_value_str.value;
      correct_guesses.value =
        BigInt(preset?.c?.toString() || 1n) || correct_guesses.value;
      target_certainty.value = Number(preset.tc) || target_certainty.value;
      threat_multiplier.value = Number(preset.tm) || threat_multiplier.value;
      lockout.value = Boolean(preset.lo) || lockout.value;
    }

    const directLink = computed(() => {
      return btoa(
        JSON.stringify({
          l: length.value,
          ml: max_length.value,
          r: nr_requests.value,
          n: notify_victim.value,
          o: online.value,
          a: alphabet.value,
          s: start_value_str.value,
          c: correct_guesses.value.toString(),
          tc: target_certainty.value,
          tm: threat_multiplier.value,
          lo: lockout.value,
        })
      );
    });

    const start_value = computed(() => {
      return base2dec(start_value_str.value);
    });

    const threshold = computed(() => {
      if (online.value) {
        if (notify_victim.value) {
          return 1000 * 60 * 60 * threat_multiplier.value; // 1hour
        } else {
          return 1000 * 60 * 60 * 24 * threat_multiplier.value; // 1day
        }
      } else {
        if (notify_victim.value) {
          return 1000 * 60 * 60 * threat_multiplier.value; // 1hour
        } else {
          return 1000 * 60 * 60 * 24 * 30 * 12 * threat_multiplier.value; // year
        }
      }
      return 1;
    });

    const requestsPerMs = computed(() => {
      return nr_requests.value / 1000;
    });

    const alphabet_preset: { [name: string]: string } = {
      numbers: "0123456789",
      hexadecimal: "0123456789abcdef",
      alphabet: "abcdefghijklmnopqrstuvwxyz",
      alphanumeric: "0123456789abcdefghijklmnopqrstuvwxyz",
      base64:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      "base64 (urlsafe)":
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    };

    const setAlphabet = (new_alphabet: string): void => {
      if (new_alphabet === undefined) return;
      const oldVal = start_value.value;
      alphabet.value = new_alphabet;
      start_value_str.value = dec2base(oldVal);
    };

    // set default

    const uniqueChars = (str: string) => {
      console.log(str);
      return [...new Set(str)].join("");
    };

    const maxNumber = computed(() => {
      console.log("xxxx");
      console.log(alphabet.value);
      console.log(length.value);
      console.log(start_value.value);
      console.log("xxxx");
      return (
        BigInt(alphabet.value.length) ** BigInt(length.value) -
        start_value.value
      );
    });

    const dec2base = (val: bigint) => {
      var n = val;
      var result = n == 0n ? alphabet.value[0] : "";
      const alphabetLen = BigInt(alphabet.value.length);
      while (n != 0n) {
        var q = n % alphabetLen;
        result = alphabet.value[Number(q)] + result;
        n = (n - q) / alphabetLen;
      }
      return result;
    };

    const base2dec = (val: string) => {
      var cache_pos: { [char: string]: bigint } = {};
      var result = 0n;
      var pow = 1n;
      const alphabetLen = BigInt(alphabet.value.length);
      for (var i = val.length - 1; i >= 0; i--) {
        var c = val[i];
        if (cache_pos[c] == undefined) {
          cache_pos[c] = BigInt(alphabet.value.indexOf(c));
        }
        result += pow * cache_pos[c];
        pow *= alphabetLen;
      }
      return result;
    };

    function randBigInt2(range: bigint) {
      // returns BigInt 0 to (range non inclusive)
      var rand = [],
        digits = (range.toString().length / 9 + 2) | 0;
      while (digits--) {
        rand.push(("" + ((Math.random() * 1000000000) | 0)).padStart(9, "0"));
      }
      return BigInt(rand.join("")) % range; // Leading zeros are ignored
    }

    const binominal = (N: bigint, k: bigint) => {
      const a = factorial(N);
      const b = factorial(k) * factorial(N - k);
      return a / b;
    };

    const probabilityPerSecond = computed(() => {
      console.log(requestsPerMs.value);
      console.log(maxNumber.value);
      return (requestsPerMs.value / Number(maxNumber.value)) * 1000;
    });

    // binominal distribution
    // ziehen mit zuruecklegen
    // beispiel fuer OTP
    const binominal_distribution = computed(() => {
      //const p = probabilityPerSecond.value;
      const p = Number(correct_guesses.value) / Number(maxNumber.value);
      const not_p = 1 - p;
      const q = target_certainty.value; // 90% probability
      const result = Math.log(1 - q) / Math.log(1 - p);
      //console.log(n)
      return isFinite(result) ? result : Infinity;
    });

    // n=1/((M/N)/e)
    const hypergeometric_distribution = computed(() => {
      const M = Number(correct_guesses.value);
      const N = Number(maxNumber.value);
      const Ex = Number(target_certainty.value);
      const result = 1 / (M / N / Ex);
      console.log(result);
      return isFinite(result) ? result : Infinity;
    });

    const tailwindcss = {
      theme: {
        colors: {
          transparent: "transparent",
          current: "currentColor",

          black: "#131A21",
          blacker: "#000000",
          white: "#ffffff",

          red: "#DD4B21",
          green: "#16c1a2",

          yellow: "#D8AD66",
          purple: "#681FC4",
          blue: "#0EC7F0",
          orange: "#FF8A00",
          pink: "#DC2CEC",

          light: "#f5f5f9",

          dark: "#1f2129",
          darker: "#151519",
        },
      },
    };

    return {
      length,
      alphabet,
      setAlphabet,
      alphabet_preset,
      maxNumber,
      nr_requests,
      uniqueChars,
      start_value_str,
      randBigInt2,
      start_value,
      requestsPerMs,
      target_certainty,
      correct_guesses,
      dec2base,
      base2dec,
      binominal_distribution,
      notify_victim,
      hypergeometric_distribution,
      humanizeDuration,
      online,
      max_length,
      tailwindcss,
      threshold,
      threat_multiplier,
      lockout,
      showSettings,
      showTab,
      directLink,
    };
  },
  components: {
    slider,
    AttackerItem,
    OverlayBlock,
  },
});
</script>
