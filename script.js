
  try {
    document.documentElement.classList.add('has-js');

    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));

    // Live uptime clock — counts up from page load, like a device status readout
    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) {
      const start = Date.now();
      const pad = n => String(n).padStart(2, '0');
      setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        uptimeEl.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
      }, 1000);
    }

    // Netmap nodes — fake-but-fun ping latency on hover
    document.querySelectorAll('.netnode').forEach((node) => {
      const tip = node.querySelector('.ping-tip');
      node.addEventListener('mouseenter', () => {
        if (tip) tip.textContent = 'ping: ' + (6 + Math.floor(Math.random() * 34)) + 'ms';
      });
    });

    // Click ripple — a little "ping" wherever you click on the page
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      document.addEventListener('click', (e) => {
        const r = document.createElement('span');
        r.className = 'ping-ripple';
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 750);
      });
    }

    // Live terminal — a tiny playable console in the hero
    const termInput = document.getElementById('termInput');
    const termOutput = document.getElementById('termOutput');
    if (termInput && termOutput) {
      const println = (text, cls, trustedHtml = false) => {
        const line = document.createElement('div');
        line.className = 'tline' + (cls ? ' ' + cls : '');
        if (trustedHtml) line.innerHTML = text;
        else line.textContent = text;
        termOutput.appendChild(line);
        termOutput.scrollTop = termOutput.scrollHeight;
      };
      const commands = {
        help: 'available: about, skills, projects, experience, contact, ping, whoami, sudo, clear',
        whoami: 'guest — but you\'re looking at elton_langat\'s console',
        about: 'Elton Langat — network engineer & IT student at JKUAT (Nairobi, KE). Hands-on with VMware vSphere, Active Directory, and web dev.',
        skills: 'networking · programming (java/c++/python) · web & databases · figma & arduino — see the <span class="accent">skills</span> section ↑',
        projects: '6 projects: verve-ecommerce, network-systems-lab, restaurant-management-system, field-service-app, construction-website, church-website — see <span class="accent">projects</span> section ↑',
        experience: 'CMC Motors (System Support) · British Heart Foundation (Volunteer) · First LEGO League (Volunteer) — see <span class="accent">log</span> section ↑',
        contact: 'email: langatelle@gmail.com · github.com/el-maritim · linkedin.com/in/elton-langat-961621375',
        ping: 'pong! latency: ' + (4 + Math.floor(Math.random() * 20)) + 'ms',
        sudo: 'nice try — access denied. insufficient privileges 🙂',
        clear: '__CLEAR__'
      };
      const runCommand = (raw) => {
        const cmd = raw.trim().toLowerCase();
        println(raw || '\u00a0', 'echo');
        if (!cmd) return;
        if (cmd === 'clear') { termOutput.innerHTML = ''; return; }
        if (Object.prototype.hasOwnProperty.call(commands, cmd)) { println(commands[cmd], '', true); }
        else { println('command not found: ' + raw + ' — try help'); }
      };
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          runCommand(termInput.value);
          termInput.value = '';
        }
      });
      document.getElementById('liveTerm').addEventListener('click', () => termInput.focus());
    }
  } catch (e) {
    document.documentElement.classList.remove('has-js');
  }
