 // --- 1. Setup SVG Ring ---
        const circle = document.getElementById('progress-bar');
        // Calculate circumference: 2 * PI * r. r is 48% of viewBox, roughly. 
        // Since we use percentages in SVG, we need to approximate or set fixed viewbox.
        // Let's set a fixed viewbox for easier math, but keep CSS responsive.
        const radius = circle.r.baseVal.valueInSpecifiedUnits; // This might be tricky with %, let's hardcode viewbox in JS or CSS
        // Actually, easiest way with % radius is to just set the dasharray in JS based on window size or use a fixed viewbox.
        // Let's use a fixed viewbox for the SVG to make the math 100% accurate.
        
        // Re-approach: Set Viewbox in JS to match CSS aspect ratio logic isn't needed if we just use a standard viewbox
        // and let CSS scale it.
        const svg = document.querySelector('.progress-ring');
        svg.setAttribute('viewBox', '0 0 100 100');
        circle.setAttribute('r', '45'); // Radius
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        
        const circumference = 2 * Math.PI * 45;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        // --- 2. Time Logic ---
        function updateClock() {
            const now = new Date();
            
            // Pakistan Time Options
            const timeOptions = {
                timeZone: 'Asia/Karachi',
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };

            const dateOptions = {
                timeZone: 'Asia/Karachi',
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            };

            // Get Time Parts
            const timeParts = new Intl.DateTimeFormat('en-US', timeOptions).formatToParts(now);
            const dateStr = new Intl.DateTimeFormat('en-PK', dateOptions).format(now);

            // Map parts
            let h = timeParts.find(p => p.type === 'hour').value;
            let m = timeParts.find(p => p.type === 'minute').value;
            let s = timeParts.find(p => p.type === 'second').value;
            let ampm = timeParts.find(p => p.type === 'dayPeriod').value;

            // Pad with zero if single digit
            if(h.length === 1) h = '0' + h;
            if(m.length === 1) m = '0' + m;
            if(s.length === 1) s = '0' + s;

            // Update DOM
            document.getElementById('hours').innerText = h;
            document.getElementById('minutes').innerText = m;
            document.getElementById('seconds').innerText = s;
            document.getElementById('ampm').innerText = ampm;
            document.getElementById('date').innerText = dateStr;

            // Update Progress Ring (Seconds)
            // Calculate percentage of the current second (0 to 59)
            // We want the ring to fill up as the second ticks.
            const secondsPercent = (s / 60) * 100;
            setProgress(secondsPercent);
        }

        // --- 3. Theme Logic ---
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }

        // Initialize
        setInterval(updateClock, 1000);
        updateClock(); // Run once immediately
