<template>
  <div class="text-white p-5 w-full">
    <h1 class="text-xl font-bold">IDOR Vuln Calculator</h1>
    <div
      class="text-white float-right cursor-pointer text-opacity-50 hover:text-white hover:text-opacity-100"
      @click="showSettings = true"
    >
      <i class="fa-solid fa-gear"></i>
    </div>

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
          Start Value
        </div>
        <div class="sm:pt-2">
          <input
            type="number"
            class="bg-darker w-full text-right rounded-md px-2 py-1"
            v-model="start_value_str"
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
              max="0.99"
              v-model.number="target_certainty"
            />
            <span class="font-bold">99%</span>
          </div>
        </div>
      </div>
    </OverlayBlock>

    <div class="mt-12">
      <div class="sm:hidden bg-dark rounded rounded-lg px-3 py-2 flex flex-row items-center">
        <label for="tabs" class="sr-only">Select a tab</label>
        <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
        Current View:
        <select
        v-model="showTab"
          id="tabs"
          name="tabs"
          class=" flex-grow ml-2 focus:ring-green focus:border-green border-dark rounded-md bg-darker px-1 py-1"
        >
          <option :value="1">IDOR Calculator</option>
          <option :value="2">Browse Examples</option>
        </select>
      </div>
      <div class="hidden sm:block">
        <div class="border-b border-dark">
          <nav class="-mb-px flex" aria-label="Tabs">
            <a
              @click="showTab = 1"
              :class="[
                showTab == 1
                  ? 'border-green text-green bg-dark'
                  : 'border-transparent text-white text-opacity-50 hover:text-opacity-100 hover:border-green',
                'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer rounded-t rounded-t-lg',
              ]"
              :aria-current="showTab == 1 ? 'page' : undefined"
            >
              IDOR Calculator
            </a>
            <a
              @click="showTab = 2"
              :class="[
                showTab == 2
                  ? 'border-green text-green bg-dark'
                  : 'border-transparent text-white text-opacity-50 hover:text-opacity-100 hover:border-green',
                'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer rounded-t rounded-t-lg',
              ]"
              :aria-current="showTab == 2 ? 'page' : undefined"
            >
              Browse Examples
            </a>
          </nav>
        </div>
      </div>
    </div>

    <div v-if="showTab == 2">
      <div>
        <button
          class="bg-green px-3 py-1 rounded rouned-lg m-1 border-1 border-green hover:border-white"
          v-for="e in Object.keys(examples)"
          @click="examples[e]()"
          :key="e"
        >
          {{ e }}
        </button>
      </div>
    </div>

    <div v-if="showTab == 1">
      <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
        <div
          class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-dark sm:pt-5"
        >
          <label
            for="username"
            class="block text-sm font-medium sm:mt-px sm:pt-2"
          >
            ID Length (<span class="text-green font-bold">{{ length }}</span
            >)
            
            </label
          >
          <div class="mt-1 sm:mt-0 sm:col-span-2">
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
            Alphabet (<span class="text-green font-bold">{{
              alphabet.length
            }}</span>
            characters)
          </label>
          <div class="mt-1 sm:mt-0 sm:col-span-2">
            <input
              class="bg-darker px-1 my-1 w-full font-mono text-white text-opacity-50 focus:text-opacity-100"
              type="text"
              v-model="alphabet"
              @input="
                () => {
                  alphabet = uniqueChars(alphabet);
                }
              "
            />
            <p class="my-2 text-sm text-gray-500">
              The characters used for the identifier. You can also select a
              preset:
            </p>
            <div>
              <button
                class="px-3 py-1 rounded rouned-lg m-1 border-2 hover:border-white"
                :class="{
                  'bg-green border-green':
                    alphabet == alphabet_preset[alphabet_name],
                  'bg-dark border-dark':
                    alphabet != alphabet_preset[alphabet_name],
                }"
                v-for="alphabet_name in Object.keys(alphabet_preset)"
                @click="setAlphabet(alphabet_preset[alphabet_name])"
              >
                {{ alphabet_name }}
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
            Threat Multiplier (<span
              class="text-green font-bold"
              v-if="threat_multiplier < 2"
              >Not Critical</span
            ><span
              class="text-yellow font-bold"
              v-else-if="threat_multiplier < 5"
              >Somewhat Critical</span
            ><span class="text-red font-bold" v-else>Very Critical</span>)
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
                    threat_multiplier >= 2 && threat_multiplier < 5,
                  'accent-red': threat_multiplier >= 5,
                }"
                min="0.01"
                step="0.01"
                max="10"
                v-model="threat_multiplier"
              />
              <span class="text-red font-bold">Very Critical</span>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              How critical is the data you try to access?
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
                    <label for="offers" class="font-medium">Lockout</label>
                    <p class="text-gray-500">
                      Is the target system/account locked after some attempts?
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
          <h1 class="text-lg font-bold">Results</h1>
        </div>

        <div
          class="sm:grid sm:grid-cols-5 sm:gap-4 sm:items-start  sm:pt-5"
        >
          <div
            class="bg-dark sm:col-span-5 md:col-start-2 md:col-end-5 rounded rounded-lg p-5"
          >
            <div>
              If every attempt is random, to find one with
              <i>{{ Math.floor(target_certainty * 100) }}%</i> certainty, you
              need
              <span class="text-green font-bold"
                >{{ Math.ceil(binominal_distribution) }} attempts</span
              >.
            </div>
            <div>
              If you search in a set, to find a specific one with
              <i>{{ Math.floor(target_certainty * 100) }}%</i> certainty, you
              need
              <span class="text-green font-bold"
                >{{ Math.ceil(hypergeometric_distribution) }} attempts</span
              >.
            </div>
            <div class="mt-2">
              With the current threat level it's considered "bad" when your
              attempts succeed in under
              <span class="text-green font-bold">{{
                humanizeDuration(threshold, {
                  largest: 1,
                  round: true,
                })
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 lg:sm:grid-cols-4 gap-4 sm:items-start  sm:pt-5"
        >
          <h1 class="text-md font-bold">Simulated Attackers</h1>
        </div>

        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 lg:sm:grid-cols-4 gap-4 sm:items-start sm:pt-5"
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

export default defineComponent({
  props: {},
  setup(props) {
    const length = ref(6);
    const showTab = ref(1);
    const max_length = ref(32);
    const nr_requests = ref(3000);
    const ip_ratelimit_requests = ref(3000);
    const target_ratelimit_requests = ref(3000);
    const notify_victim = ref(false);
    const online = ref(true);
    const alphabet = ref("");
    const start_value_str = ref("");
    const correct_guesses = ref(1n);
    const target_certainty = ref(0.95);
    const threat_multiplier = ref(1);
    const lockout = ref(false);
    const showSettings = ref(false);

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

    const rate_preset: { [name: string]: string } = {};

    const setAlphabet = (new_alphabet: string): void => {
      const oldVal = start_value.value;
      alphabet.value = new_alphabet;
      start_value_str.value = dec2base(oldVal);
    };

    // set default

    const examples: { [name: string]: Function } = {
      "32bit stack cookie": () => {
        length.value = 6;
        setAlphabet(alphabet_preset["hexadecimal"]);
        nr_requests.value = 3000;
        correct_guesses.value = 1n;
        notify_victim.value = false;
        online.value = false;
        lockout.value = false;
      },
      "4 digit bank pin": () => {
        length.value = 4;
        setAlphabet(alphabet_preset["numbers"]);
        nr_requests.value = 1;
        correct_guesses.value = 1n;
        notify_victim.value = true;
        online.value = false;
        lockout.value = true;
      },
      "6 digit SMS OTP": () => {
        length.value = 6;
        setAlphabet(alphabet_preset["numbers"]);
        nr_requests.value = 100;
        correct_guesses.value = 1n;
        notify_victim.value = true;
        online.value = true;
        lockout.value = false;
      },
      "6 digit TOTP": () => {
        length.value = 6;
        setAlphabet(alphabet_preset["numbers"]);
        nr_requests.value = 100;
        correct_guesses.value = 3n;
        notify_victim.value = false;
        online.value = true;
        lockout.value = false;
      },
      "Twitter 8 char OTP": () => {
        length.value = 8;
        setAlphabet(alphabet_preset["alphanumeric"]);
        nr_requests.value = 100;
        correct_guesses.value = 1n;
        notify_victim.value = true;
        online.value = true;
        lockout.value = false;
      },
      "unlisted YouTube": () => {
        length.value = 11;
        setAlphabet(alphabet_preset["base64 (urlsafe)"]);
        nr_requests.value = 10_000;
        correct_guesses.value = 800_000_000n / 100n; // 800 million total
        notify_victim.value = false;
        online.value = true;
        lockout.value = false;
      },
      pastebin: () => {
        length.value = 8;
        setAlphabet(
          alphabet_preset["alphanumeric"] + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        );
        nr_requests.value = 10_000;
        correct_guesses.value = 95_000_000n / 10n; // 95 million total https://techcrunch.com/2015/12/16/pastebin-the-text-sharing-website-updates-with-an-emphasis-on-code/
        notify_victim.value = false;
        online.value = true;
        lockout.value = false;
      },
    };

    const uniqueChars = (str: string) => {
      console.log(str);
      return [...new Set(str)].join("");
    };

    const maxNumber = computed(() => {
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
        result = alphabet.value[q] + result;
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

    setAlphabet(alphabet_preset["hexadecimal"]);

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
      examples,
      online,
      max_length,
      tailwindcss,
      ip_ratelimit_requests,
      target_ratelimit_requests,
      threshold,
      threat_multiplier,
      lockout,
      showSettings,
      showTab,
    };
  },
  components: {
    slider,
    AttackerItem,
    OverlayBlock,
  },
});
</script>
