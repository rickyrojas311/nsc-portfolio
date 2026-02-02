document.addEventListener('DOMContentLoaded', function() {

    const artifacts = [
        { title: "Mexico Cartels", category: "Infographic", link: "pg1.html", audience: "General", focus: 1, bodyText: "An ancient lens that focuses starlight into coherent data streams, revealing secrets of distant galaxies." },
        { title: "Flights", category: "Infographic", link: "pg2.html", audience: "General", focus: 0.95, bodyText: "A device that measures temporal displacement, crucial for understanding time-dilation effects near massive objects." },
        { title: "Building Brains", category: "Exhibit", link: "pg4.html", audience: "General", focus: 0.8, bodyText: "Extracts and stores faint consciousness imprints from the quantum foam." },
        { title: "Campus Board", category: "Exhibit", link: "pg5.html", audience: "General", focus: 0.9, bodyText: "A crystal that resonates with the gravitational waves of binary stars, creating complex auditory patterns." },
        { title: "Teaching", category: "Infographic", link: "pg3.html", audience: "General", focus: 0.8, bodyText: "A fabric woven from solidified vacuum energy, providing unparalleled protection against cosmic radiation." },
        { title: "ISMRM Presentation", category: "Poster", link: "pg3.html", audience: "Specialized", focus: 0.2, bodyText: "A light-sail designed to navigate the turbulent energy currents of inter-dimensional rifts." },
        { title: "Pronoun Coreference", category: "Paper", link: "pg6.html", audience: "Specialized", focus: 0.6, bodyText: "Generates a localized, stable gravity field, essential for starship docking and habitat stabilization." },
        { title: "Speaker Decoding", category: "Paper", link: "pg7.html", audience: "Specialized", focus: 0.5, bodyText: "A quantum device that calculates and displays the most likely outcomes of any given event." },
        { title: "Attention Morphology", category: "Poster", link: "pg5.html", audience: "Specialized", focus: 0.4, bodyText: "Uses subspace echoes to map terrains and structures obscured by dense matter or energy fields." },
    ];

    artifacts.sort((a, b) => a.category.localeCompare(b.category));

    const container = document.getElementById('bubble-chart-container');
    const audienceContainer = document.getElementById('audience-view-container');
    if (!container) return;
    if (audienceContainer) audienceContainer.style.display = 'none';

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
    const color = d3.scaleOrdinal(d3.schemeTableau10).domain(categories);
    
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

    // --- SIMULATION ---
    const simulation = d3.forceSimulation(artifacts)
        .force("x", d3.forceX((d, i) => xScale(i)).strength(0.5))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-15))
        .force("collide", d3.forceCollide(d => d.size + 2).strength(1));

    function setBubbleSizes() {
        let baseRadius = Math.max(width / 18, 35); 
        artifacts.forEach(d => {
            const isLongTitle = d.title.length > 10;
            const isFocused = d.focus > 0;
            d.size = baseRadius * ((isFocused || isLongTitle) ? 1.25 : 0.85);
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
        .on("click", d => window.location.href = d.link);

    const bubbles = nodeGroup.append("circle")
        .attr("r", d => d.size)
        .attr("fill", d => color(d.category))
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
        } else {
            groupNodes = artifacts.filter(item => item.category === d.category);
        }

        const minX = d3.min(groupNodes, b => b.x - b.size);
        const maxX = d3.max(groupNodes, b => b.x + b.size);

        tooltip.transition().duration(200).style("opacity", .95);
        
        if (currentView === 'audience') {
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
                } else {
                    return (b.category === d.category) ? 1 : 0.4;
                }
            });

        bubbles.transition().duration(200)
             .style("fill", b => {
                if (b === d) return d3.rgb(color(b.category)).darker(1.5);
                
                if (currentView === 'audience') {
                    if (b.audience !== d.audience) return "#d3d3d3";
                } else {
                    if (b.category !== d.category) return "#d3d3d3";
                }
                
                return color(b.category);
             });
        
        labels.transition().duration(200)
            .style("fill", b => (b === d) ? "white" : "black");
        
        self.select('circle').style("stroke", "#333");
    }

    function handleMouseOut(event, d) {
        tooltip.transition().duration(500).style("opacity", 0);
        nodeGroup.transition().duration(200).attr("opacity", 1);
        bubbles.transition().duration(200).style("fill", b => color(b.category));
        labels.transition().duration(200).style("fill", "black");
        d3.selectAll('.bubble').style("stroke", "#fff");
    }

    function updatePositions() {
        // --- UPDATED HEIGHT LOGIC ---
        const baseRadius = Math.max(width / 18, 35);
        
        if (currentView === 'type') {
            // REDUCED: Was baseRadius * 12, now * 6
            height = baseRadius * 6; 
            
            svg.transition().duration(1500)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);

            xScale.range([width * 0.15, width * 0.85]);
            
            simulation.force("x", d3.forceX((d, i) => xScale(i)).strength(0.1));
            simulation.force("y", d3.forceY(height / 2).strength(0.1));
            
            audienceLabels.transition().duration(1000).style("opacity", 0);

        } else {
            // REDUCED: Was baseRadius * 20, now * 14
            height = baseRadius * 10;

            svg.transition().duration(1500)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);

            const centerLeft = width * 0.27; 
            const centerRight = width * 0.73;
            
            simulation.force("x", d3.forceX(d => 
                d.audience === 'General' ? centerLeft : centerRight
            ).strength(0.2));

            simulation.force("y", d3.forceY(height * 0.5).strength(0.1));

            labelGeneral.attr("x", centerLeft).attr("y", 40); 
            labelSpecialized.attr("x", centerRight).attr("y", 40);
            
            audienceLabels.transition().duration(1500).style("opacity", 1);
        }

        simulation.alpha(0.5).restart();
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

    if (typeViewBtn) {
        typeViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentView === 'type') return;
            currentView = 'type';
            typeViewBtn.classList.add('primary');
            if (audienceViewBtn) audienceViewBtn.classList.remove('primary');
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
            updatePositions();
        });
    }

    updatePositions();
});