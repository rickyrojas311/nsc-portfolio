document.addEventListener('DOMContentLoaded', function() {

    const artifacts = [
        { title: "Mexico Cartels", category: "Infographic", link: "pg1.html", audience: "General", focus: 1, scale: 4, bodyText: "An ancient lens that focuses starlight into coherent data streams, revealing secrets of distant galaxies." },
        { title: "Flights", category: "Infographic", link: "pg2.html", audience: "General", focus: 1, scale: 3.5, bodyText: "A device that measures temporal displacement, crucial for understanding time-dilation effects near massive objects." },
        { title: "Building Brains", category: "Exhibit", link: "pg4.html", audience: "General", focus: 1, scale: 4.5, bodyText: "Extracts and stores faint consciousness imprints from the quantum foam." },
        { title: "Campus Board", category: "Exhibit", link: "pg5.html", audience: "General", focus: 2, scale: 4.2, bodyText: "A crystal that resonates with the gravitational waves of binary stars, creating complex auditory patterns." },
        { title: "Teaching", category: "Infographic", link: "pg3.html", audience: "General", focus: 1, scale: 5, bodyText: "A fabric woven from solidified vacuum energy, providing unparalleled protection against cosmic radiation." },
        { title: "ISMRM Presentation", category: "Poster", link: "pg3.html", audience: "Specialized", focus: 3, scale: 4.2, bodyText: "A light-sail designed to navigate the turbulent energy currents of inter-dimensional rifts." },
        { title: "Neural Coreference", category: "Paper", link: "neural_coreference.html", audience: "Specialized", focus: 4, scale: 5, bodyText: "Generates a localized, stable gravity field, essential for starship docking and habitat stabilization." },
        { title: "Speaker Decoding", category: "Paper", link: "speaker_decoding.html", audience: "Specialized", focus: 4, scale: 4.5, bodyText: "A quantum device that calculates and displays the most likely outcomes of any given event." },
        { title: "Attention Morphology", category: "Poster", link: "pg5.html", audience: "Specialized", focus: 4, scale: 4.2, bodyText: "Uses subspace echoes to map terrains and structures obscured by dense matter or energy fields." },
    ];

    const formatOrder = ["Exhibit", "Infographic", "Poster", "Paper"];
    artifacts.sort((a, b) => formatOrder.indexOf(a.category) - formatOrder.indexOf(b.category));

    const container = document.getElementById('bubble-chart-container');
    if (!container) return;

    container.style.position = "relative";

    const tooltip = d3.select(container).append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none");

    let width = container.clientWidth;
    // Initial placeholder height
    let height = 300; 
    let currentView = 'type'; 

    const svg = d3.select(container).append("svg")
        .attr("id", "bubble-chart")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

    const categories = [...new Set(artifacts.map(d => d.category))];

    const bubbleColors = [
        "#8624ca",
        "#be50d9",
        "#d472d3",
        "#d78dd2",
        "#d5a3d8",
        "#a479d8",
        "#8b58d2",
        "#853ecf",
        "#8624ca"
    ];

    artifacts.forEach((d, i) => d.color = bubbleColors[i]);
    
    const xScale = d3.scaleLinear()
        .domain([0, artifacts.length - 1])
        .range([width * 0.15, width * 0.85]); 

    // --- AUDIENCE VIEW LABELS ---
    const audienceLabels = svg.append("g")
        .attr("class", "audience-labels")
        .style("opacity", 0)
        .style("pointer-events", "none");

    const labelGeneral = audienceLabels.append("text")
        .text("General Audience")
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .style("font-weight", "800")
        .style("font-size", "32px");

    const labelSpecialized = audienceLabels.append("text")
        .text("Specialized Audience")
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .style("font-weight", "800")
        .style("font-size", "32px");

    // --- FOCUS VIEW ELEMENTS ---
    const focusAxisGroup = svg.append("g")
        .attr("class", "focus-axis")
        .style("opacity", 0)
        .style("pointer-events", "none");

    const focusLabelLeft = focusAxisGroup.append("text")
        .text("← Human Learning")
        .attr("class", "focus-label")
        .attr("text-anchor", "start");

    const focusLabelRight = focusAxisGroup.append("text")
        .text("Computational Learning →")
        .attr("class", "focus-label")
        .attr("text-anchor", "end");

    // --- FORMAT VIEW ELEMENTS ---
    const formatAxisGroup = svg.append("g")
        .attr("class", "focus-axis")
        .style("opacity", 0)
        .style("pointer-events", "none");

    const formatLabelLeft = formatAxisGroup.append("text")
        .text("← More Visual")
        .attr("class", "focus-label")
        .attr("text-anchor", "start");

    const formatLabelRight = formatAxisGroup.append("text")
        .text("More Textual →")
        .attr("class", "focus-label")
        .attr("text-anchor", "end");

    // --- SIMULATION ---
    const simulation = d3.forceSimulation(artifacts)
        .force("x", d3.forceX((d, i) => xScale(i)).strength(0.5))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-15))
        .force("collide", d3.forceCollide(d => d.size + 2).strength(1))
        .alphaDecay(0.05);

    function setBubbleSizes() {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        artifacts.forEach(d => {
            d.size = d.scale * rem;
        });
        simulation.force("collide", d3.forceCollide(d => d.size + 2).strength(1));
    }

    setBubbleSizes();
    for (let i = 0; i < 150; ++i) simulation.tick();

    const nodeGroup = svg.append("g")
        .selectAll("g")
        .data(artifacts)
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", (event, d) => window.location.href = d.link);

    const bubbles = nodeGroup.append("circle")
        .attr("r", d => d.size)
        .attr("fill", d => d.color)
        .attr("class", "bubble");

    const labels = nodeGroup.append("text")
        .attr("class", "bubble-title")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("pointer-events", "none") 
        .each(function(d) {
            const el = d3.select(this);
            const words = d.title.split(/\s+/); 
            const lineHeight = 1.1; 
            let dy = 0.3 - ((words.length - 1) * lineHeight / 2);
            words.forEach((word, index) => {
                el.append("tspan")
                    .text(word)
                    .attr("x", 0)
                    .attr("dy", index === 0 ? `${dy}em` : `${lineHeight}em`);
            });
        });

    function handleMouseOver(event, d) {
        let groupNodes;
        if (currentView === 'audience') {
            groupNodes = artifacts.filter(item => item.audience === d.audience);
        } else if (currentView === 'focus') {
            groupNodes = artifacts.filter(item => item.focus === d.focus);
        } else {
            groupNodes = artifacts.filter(item => item.category === d.category);
        }

        const minX = d3.min(groupNodes, b => b.x - b.size);
        const maxX = d3.max(groupNodes, b => b.x + b.size);

        tooltip.transition().duration(200).style("opacity", .95);
        
        if (currentView === 'audience' || currentView === 'focus') {
            tooltip.html(`
                <p style="margin: 0;">${d.bodyText}</p>
            `);
        } else {
            tooltip.html(`
                <h3 style="margin: 0 0 5px 0;">${d.category}</h3>
                <p style="margin: 0;">${d.bodyText}</p>
            `);
        }

        const tooltipWidth = tooltip.node().offsetWidth;
        const padding = 25;

        let targetLeft = maxX + padding;
        if (targetLeft + tooltipWidth > width - 10) {
            targetLeft = minX - tooltipWidth - padding;
        }

        tooltip
            .style("left", `${targetLeft}px`)
            .style("top", `${d.y}px`) 
            .style("transform", "translateY(-50%)");

        const self = d3.select(this);

        nodeGroup.transition().duration(200)
            .attr("opacity", b => {
                if (currentView === 'audience') {
                    return (b.audience === d.audience) ? 1 : 0.4;
                } else if (currentView === 'focus') {
                    return (b.focus === d.focus) ? 1 : 0.4;
                } else {
                    return (b.category === d.category) ? 1 : 0.4;
                }
            });

        bubbles.transition().duration(200)
             .style("fill", b => {
                if (b === d) return d3.rgb(b.color).darker(1.5);
                
                if (currentView === 'audience') {
                    if (b.audience !== d.audience) return "#d3d3d3";
                } else if (currentView === 'focus') {
                    if (b.focus !== d.focus) return "#d3d3d3";
                } else {
                    if (b.category !== d.category) return "#d3d3d3";
                }
                
                return b.color;
             });
        
        labels.transition().duration(200)
            .style("fill", b => (b === d) ? "white" : "black");
        
        self.select('circle').style("stroke", "#333");
    }

    function handleMouseOut(event, d) {
        tooltip.transition().duration(500).style("opacity", 0);
        nodeGroup.transition().duration(200).attr("opacity", 1);
        bubbles.transition().duration(200).style("fill", b => b.color);
        labels.transition().duration(200).style("fill", "black");
        d3.selectAll('.bubble').style("stroke", "#fff");
    }

    function updatePositions() {
        // --- UPDATED HEIGHT LOGIC ---
        if (currentView === 'type') {
            artifacts.sort((a, b) => formatOrder.indexOf(a.category) - formatOrder.indexOf(b.category));
        } else if (currentView === 'focus') {
            artifacts.sort((a, b) => a.focus - b.focus);
        }
        simulation.nodes(artifacts);

        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const baseRadius = Math.max(width / 18, 35);
        const labelLeft = width * 0.05;
        const labelRight = width * 0.95;
        const scaleLeft = width * 0.1;
        const scaleRight = width * 0.9;
        
        if (currentView === 'type') {
            // REDUCED: Was baseRadius * 12, now * 6
            height = baseRadius * 7; 
            
            svg.transition().duration(1000)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);

            xScale.range([scaleLeft, scaleRight]);

            const labelY = height - (0.3 * rem);
            
            formatLabelLeft
                .attr("x", labelLeft)
                .attr("y", labelY);

            formatLabelRight
                .attr("x", labelRight)
                .attr("y", labelY);
            
            simulation.force("x", d3.forceX((d, i) => xScale(i)).strength(0.5));
            simulation.force("y", d3.forceY(height / 2).strength(0.1));
            
            audienceLabels.transition().duration(500).style("opacity", 0);
            focusAxisGroup.transition().duration(500).style("opacity", 0);
            const hasControls = document.getElementById('type-view-btn');
            formatAxisGroup.transition().duration(500).style("opacity", hasControls ? 1 : 0);

        } else if (currentView === 'audience') {
            // REDUCED: Was baseRadius * 20, now * 14
            height = baseRadius * 10;

            svg.transition().duration(500)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);

            const centerLeft = width * 0.27; 
            const centerRight = width * 0.73;
            
            simulation.force("x", d3.forceX(d => 
                d.audience === 'General' ? centerLeft : centerRight
            ).strength(0.3));

            simulation.force("y", d3.forceY(height * 0.5).strength(0.1));

            labelGeneral.attr("x", centerLeft).attr("y", 40); 
            labelSpecialized.attr("x", centerRight).attr("y", 40);
            
            audienceLabels.transition().duration(500).style("opacity", 1);
            focusAxisGroup.transition().duration(500).style("opacity", 0);
            formatAxisGroup.transition().duration(500).style("opacity", 0);

        } else if (currentView === 'focus') {
            // Reuse 'type' view logic for layout
            height = baseRadius * 7;

            svg.transition().duration(1000)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);

            xScale.range([scaleLeft, scaleRight]);

            const labelY = height - (0.3 * rem);
            
            focusLabelLeft
                .attr("x", labelLeft)
                .attr("y", labelY);

            focusLabelRight
                .attr("x", labelRight)
                .attr("y", labelY);

            audienceLabels.transition().duration(500).style("opacity", 0);
            formatAxisGroup.transition().duration(500).style("opacity", 0);
            focusAxisGroup.transition().duration(500).style("opacity", 1);

            simulation.force("x", d3.forceX((d, i) => xScale(i)).strength(0.5));
            simulation.force("y", d3.forceY(height / 2).strength(0.1));
        }

        simulation.alpha(1).restart();
    }

    simulation.on("tick", () => {
         nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function resize() {
        width = container.clientWidth;
        setBubbleSizes();
        updatePositions(); 
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 250);
    });

    const typeViewBtn = document.getElementById('type-view-btn');
    const audienceViewBtn = document.getElementById('audience-view-btn');
    const focusViewBtn = document.getElementById('focus-view-btn');

    const formatDesc = document.getElementById('format-description');
    const audienceDesc = document.getElementById('audience-description');
    const focusDesc = document.getElementById('focus-description');

    function updateDescription(view) {
        if (formatDesc) formatDesc.style.display = view === 'type' ? 'block' : 'none';
        if (audienceDesc) audienceDesc.style.display = view === 'audience' ? 'block' : 'none';
        if (focusDesc) focusDesc.style.display = view === 'focus' ? 'block' : 'none';
    }

    if (typeViewBtn) {
        typeViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentView === 'type') return;
            currentView = 'type';
            typeViewBtn.classList.add('primary');
            if (audienceViewBtn) audienceViewBtn.classList.remove('primary');
            if (focusViewBtn) focusViewBtn.classList.remove('primary');
            updateDescription('type');
            updatePositions();
        });
    }

    if (audienceViewBtn) {
        audienceViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentView === 'audience') return;
            currentView = 'audience';
            audienceViewBtn.classList.add('primary');
            if (typeViewBtn) typeViewBtn.classList.remove('primary');
            if (focusViewBtn) focusViewBtn.classList.remove('primary');
            updateDescription('audience');
            updatePositions();
        });
    }

    if (focusViewBtn) {
        focusViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentView === 'focus') return;
            currentView = 'focus';
            focusViewBtn.classList.add('primary');
            if (typeViewBtn) typeViewBtn.classList.remove('primary');
            if (audienceViewBtn) audienceViewBtn.classList.remove('primary');
            updateDescription('focus');
            updatePositions();
        });
    }

    updatePositions();
});