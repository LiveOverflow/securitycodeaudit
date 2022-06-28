<template>
  <div class="text-white p-5 w-full">
    <h1>IDOR Vuln Calculator</h1>
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
    <div class="my-5">
      length <span class="text-green font-bold">{{ length }}</span>
      <div class="w-1/2">
        <slider
          v-model="length"
          :max="max_length"
          :min="1"
          :tooltip="true"
          tooltipText="length %v"
          :height="8"
          :sticky="true"
          :color="tailwindcss.theme.colors['green']"
          :track-color="tailwindcss.theme.colors['dark']"
        />
      </div>
    </div>

    <div
      class="ml-2 my-2 border border-white inline-block p-2 rounded rounded-lg opacity-20 transition duration-200 hover:opacity-100"
    >
      <b>Advanced Settings</b>
      <div>
        max length
        <input
          type="number"
          class="bg-dark px-1 my-1 w-12"
          v-model="max_length"
        />
      </div>
      <div>
        start value
        <input
          class="bg-dark px-1 my-1 w-32"
          type="text"
          v-model="start_value_str"
        />
      </div>
      
    <div>
      certainty

      <div class="w-full">
        <slider
          v-model="target_certainty"
          :step="0.01"
          :min="0.01"
          :max="0.99"
          :tooltip="true"
          :formatTooltip="(n: number) => `${Math.ceil(n*100)}% certainty`"
          :height="8"
          :sticky="true"
          :color="tailwindcss.theme.colors['green']"
          :track-color="tailwindcss.theme.colors['dark']"
        />
      </div>
    </div>
    </div>
    <div class="mt-5">
      alphabet size
      <span class="text-green font-bold">{{ alphabet.length }}</span>
      <br />
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

      <div>
        <button
          class="px-3 py-1 rounded rouned-lg m-1 border-2 hover:border-white"
          :class="{
            'bg-green border-green': alphabet == alphabet_preset[alphabet_name],
            'bg-dark border-dark': alphabet != alphabet_preset[alphabet_name],
          }"
          v-for="alphabet_name in Object.keys(alphabet_preset)"
          @click="setAlphabet(alphabet_preset[alphabet_name])"
        >
          {{ alphabet_name }}
        </button>
      </div>
    </div>
    <div class="mt-5">
      <div>
        <span class="text-green font-bold">{{ maxNumber }}</span> Possibilities
      </div>
      <div class="my-2">
        <div class=" my-2 flex flex-wrap">
          
        Example values:
            <div v-for="(x, i) in new Array(5)" class="font-mono mx-2 text-white text-opacity-50">
              {{
                dec2base(
                  start_value + randBigInt2(maxNumber - start_value)
                ).padStart(length, alphabet[0])
              }}
            </div>
        </div>
      </div>
    </div>
    <div>
      source ratelimit
      <input
        type="number"
        class="bg-dark text-right px-1 w-24"
        v-model="ip_ratelimit_requests"
      />
      requests/s (per computer/ip/device)
    </div>
    <div>
      target ratelimit
      <input
        type="number"
        class="bg-dark text-right px-1 w-24"
        v-model="target_ratelimit_requests"
      />
      requests/s (per account/target/device)
    </div>
    <div>
      correct guesses
      <input class="bg-dark w-24" type="number" v-model="correct_guesses" />
    </div>
    <div>
      threat multiplier

      <div class="w-1/2">
        <slider
          v-model="threat_multiplier"
          :step="0.01"
          :min="0.01"
          :max="10"
          :tooltip="true"
          :formatTooltip="(n: number) => `threat ${Math.round(n*100)/100}x`"
          :height="8"
          :sticky="true"
          :color="tailwindcss.theme.colors['red']"
          :track-color="tailwindcss.theme.colors['dark']"
        />
      </div>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="notify_victim" />
        attempts notifies victims
      </label>

      <label>
        <input type="checkbox" v-model="online" />
        online attack
      </label>
      <label>
        <input type="checkbox" v-model="lockout" />
        lockout
      </label>
    </div>
    <div class="flex">
      <div class="bg-dark rounded rounded-lg p-5 mt-5">
      <div>
        You need <span class="text-green font-bold">{{ Math.ceil(binominal_distribution) }} attempts</span> to find
        one with {{ Math.floor(target_certainty * 100) }}% if every time it's
        random.
      </div>
      <div>
        You need <span class="text-green font-bold">{{ Math.ceil(hypergeometric_distribution) }} attempts</span> to
        find one with {{ Math.floor(target_certainty * 100) }}% if we search a
        set.
      </div>
      <div class="mt-2">
        Current threat level considers it "bad" when you succeed in under <span class="text-green font-bold">{{
            humanizeDuration(threshold, {
              largest: 1,
              round: true,
            })
        }}</span>
        
      </div>
    </div>
    </div>
    <div>
    <div class="flex flex-wrap">
        <AttackerItem
            v-if="online"
            :binominal_distribution="binominal_distribution"
            :target_certainty="target_certainty"
            :hypergeometric_distribution="hypergeometric_distribution"
            :threshold="threshold"
            :requestsPerMs="5/1000"
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
            :requestsPerMs="200/1000"
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
            :requestsPerMs="1000/1000"
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
            :requestsPerMs="100000/1000"
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
            :requestsPerMs="1/10000"
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
            :requestsPerMs="2/1000"
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
            :requestsPerMs="10000/1000"
            name="Hardware Hacker"
            description="Specialized tooling and parallelism"
        />
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

export default defineComponent({
  props: {},
  setup(props) {
    const length = ref(6);
    const max_length = ref(16);
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

    const start_value = computed(() => {
      return base2dec(start_value_str.value);
    });

    const threshold = computed(() => {
        if(online.value) {
            if(notify_victim.value) {
                return 1000*60*60 * threat_multiplier.value; // 1hour
            } else {
                return 1000*60*60*24 * threat_multiplier.value; // 1day
            }
        } else {
            if(notify_victim.value) {
                return 1000*60*60 * threat_multiplier.value; // 1hour
            } else {
                return 1000*60*60*24*30*12 * threat_multiplier.value; // year
            }
        }
        return 1;
    })

    const requestsPerMs = computed(() => {
      return nr_requests.value / 1000;
    });

    const alphabet_preset: { [name: string]: string } = {
      "0-9": "0123456789",
      "a-z": "abcdefghijklmnopqrstuvwxyz",
      "0-9a-z": "0123456789abcdefghijklmnopqrstuvwxyz",
      hex: "0123456789abcdef",
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
        setAlphabet(alphabet_preset["hex"]);
        nr_requests.value = 3000;
        correct_guesses.value = 1n;
        notify_victim.value = false;
        online.value = false;
        lockout.value = false;
      },
      "4 digit bank pin": () => {
        length.value = 4;
        setAlphabet(alphabet_preset["0-9"]);
        nr_requests.value = 1;
        correct_guesses.value = 1n;
        notify_victim.value = true;
        online.value = false;
        lockout.value = true;
      },
      "6 digit SMS OTP": () => {
        length.value = 6;
        setAlphabet(alphabet_preset["0-9"]);
        nr_requests.value = 100;
        correct_guesses.value = 1n;
        notify_victim.value = true;
        online.value = true;
        lockout.value = false;
      },
      "6 digit TOTP": () => {
        length.value = 6;
        setAlphabet(alphabet_preset["0-9"]);
        nr_requests.value = 100;
        correct_guesses.value = 3n;
        notify_victim.value = false;
        online.value = true;
        lockout.value = false;
      },
      "Twitter 8 char OTP": () => {
        length.value = 8;
        setAlphabet(alphabet_preset["0-9a-z"]);
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
        setAlphabet(alphabet_preset["0-9a-z"] + "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
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
      console.log(result)
      return isFinite(result) ? result : Infinity;
    });

    setAlphabet(alphabet_preset["hex"]);

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
      lockout
    };
  },
  components: {
    slider,
    AttackerItem,
  },
});
</script>
