<template>
  <div class="text-white p-5 w-full">
    <h1 class="text-xl font-bold"><span class="text-green font-bold">IDOR</span> Examples</h1>
    
    <p class="lg:w-2/3 mt-2">
      Explore various examples of random IDs regarding their bruteforce resistance. 
      This is applicable to <span class="text-green font-bold">I</span>nsecure 
      <span class="text-green font-bold">D</span>irect 
      <span class="text-green font-bold">O</span>bject 
      <span class="text-green font-bold">R</span>eference vulnerabilities, two-factor authentication or session tokens.

    </p>

    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          class="bg-dark rounded rounded-lg p-5 mt-5 flex flex-col"
          v-for="(e, i) in examples"
          :key="i"
        >
          <h1 class="font-bold text-xl">{{ e.title }}</h1>
          <div v-html="e.description" class="my-2 flex-grow text-sm text-white text-grey transition"></div>
          <button
            class="bg-green text-sm px-3 py-2 rounded rouned-lg m-1 border-2 border-green hover:border-white"
            @click="
              e.set();
              $router.push({ name: 'idor-calculator' });
            "
          >
            SHOW IN CALCULATOR
          </button>
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
import { useIdorStore } from "@/stores/IdorStore";

export default defineComponent({
  props: {},
  setup(props) {
    const store = useIdorStore();

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

    const start_value = computed(() => {
      return base2dec(start_value_str.value);
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
      const oldVal = start_value.value;
      alphabet.value = new_alphabet;
      start_value_str.value = dec2base(oldVal);
    };

    // set default

    const examples: {
      [name: string]: { set: Function; title: string; description: string };
    } = {
      "6 digit SMS OTP": {
        set: () => {
          length.value = 6;
          setAlphabet(alphabet_preset["numbers"]);
          nr_requests.value = 100;
          correct_guesses.value = 1n;
          notify_victim.value = true;
          online.value = true;
          lockout.value = false;
        },
        description: "6 digit one-time passwords are often used for two-factor authentication with SMS or Email. Even if an attacker has no access to the phone or email account, could an attacker still guess it?",
        title: "6 Digit SMS or Email OTP",
      },
      "6 digit TOTP": {
        set: () => {
          length.value = 6;
          max_length.value = 12;
          setAlphabet(alphabet_preset["numbers"]);
          nr_requests.value = 100;
          correct_guesses.value = 3n;
          notify_victim.value = false;
          online.value = true;
          lockout.value = false;
        },
        description: `Some systems offer time-based one-time passwords using an authenticator like <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" class="text-green hover:underline" target="_blank"?>Google Authenticator</a>. A compromised email or SIM card has no impact on it. However sliding windows might lead to three OTPs being valid at any given time.`,
        title: "6 Digit TOTP",
      },
      "Twitter 8 char OTP": {
        set: () => {
          length.value = 8;
          max_length.value = 12;
          setAlphabet(alphabet_preset["alphanumeric"]);
          nr_requests.value = 100;
          correct_guesses.value = 1n;
          notify_victim.value = true;
          online.value = true;
          lockout.value = false;
        },
        description: "Twitter uses an 8 character long one-time password for two-factor authentication, how much of an improvement is it to the more common 6 digit pin?",
        title: "Twitter's 8 Characters OTP",
      },
      "unlisted YouTube": {
        set: () => {
          length.value = 11;
          max_length.value = 16;
          setAlphabet(alphabet_preset["base64 (urlsafe)"]);
          nr_requests.value = 10_000;
          correct_guesses.value = 800_000_000n / 100n; // 800 million total
          notify_victim.value = false;
          online.value = true;
          lockout.value = false;
        },
        description: "There exist over 800 million YouTube videos, some of them are unlisted and can only be viewed with the link. Could an attacker guess random IDs and find possibly private and sensitive videos?",
        title: "Unlisted YouTube Videos",
      },
      pastebin: {
        set: () => {
          length.value = 8;
          max_length.value = 12;
          setAlphabet(
            alphabet_preset["alphanumeric"] + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          );
          nr_requests.value = 10_000;
          correct_guesses.value = 95_000_000n / 10n; // 95 million total https://techcrunch.com/2015/12/16/pastebin-the-text-sharing-website-updates-with-an-emphasis-on-code/
          notify_victim.value = false;
          online.value = true;
          lockout.value = false;
        },
        description: `Paste websites are often used to quickly share text content. Some criminals use it to dump credentials, other use it as a temporary storage to copy sensitive data. If you could guess a <a href="https://pastebin.com" class="text-green hover:underline" target="_blank"?>pastebin.com</a> ID you could stumble over sensitive data.`,
        title: "pastebin.com Links",
      },
      "32bit stack cookie": {
        set: () => {
          length.value = 6;
          max_length.value = 16;
          setAlphabet(alphabet_preset["hexadecimal"]);
          nr_requests.value = 3000;
          correct_guesses.value = 1n;
          notify_victim.value = false;
          online.value = false;
          lockout.value = false;
        },
        description: `Stack cookies are used as a mitigation against stack buffer overflow attacks. On a 32bit system this cookie has a max value of <code class=>0x00ffffff</code>, which makes it feasible to bruteforce.<br/>You can see this in practice here: <a class="text-green hover:underline" href="https://www.youtube.com/watch?v=KGzHcqJV-QM" target="_blank">https://www.youtube.com/watch?v=KGzHcqJV-QM</a>`,
        title: "32bit Stack Cookie",
      },
      "4 digit bank pin": {
        set: () => {
          length.value = 4;
          max_length.value = 8;
          setAlphabet(alphabet_preset["numbers"]);
          nr_requests.value = 1;
          correct_guesses.value = 1n;
          notify_victim.value = true;
          online.value = false;
          lockout.value = true;
        },
        description: "A debit card uses a 4 digit pin, but is it secure? Could an attacker guess the pin?",
        title: "4 Digit Bank Pin",
      },
    };

    const uniqueChars = (str: string) => {
      console.log(str);
      return [...new Set(str)].join("");
    };

    
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
      nr_requests,
      uniqueChars,
      start_value_str,
      start_value,
      target_certainty,
      correct_guesses,
      notify_victim,
      humanizeDuration,
      examples,
      online,
      max_length,
      tailwindcss,
      threat_multiplier,
      lockout,
    };
  },
  components: {
    slider,
    AttackerItem,
    OverlayBlock,
  },
});
</script>
