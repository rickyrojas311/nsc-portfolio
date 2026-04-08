document.addEventListener('DOMContentLoaded', function() {

    const artifacts = [
        { title: "Visualing Cartels", category: "Infographic", link: "artifacts/mexico_cartel.html", audience: "General", focus: 1, scale: 4, date: "2023-05-03", displayDate: "May 2023", bodyText:
             "This infographic employs choropleths and cohesive theming to distill the security risks of cartels in Mexico. It serves as an early exploration of balancing <b>aesthetic cohesion</b> with the <b>integrity of disparate data sources</b>." },
        { title: "Paper Planes", category: "Infographic", link: "artifacts/flights.html", audience: "General", focus: 1, scale: 3.5, date: "2023-11-01", displayDate: "Nov. 2023", bodyText:
             "This explainer video utilizes a 'paper-and-pen' animation technique to distill complex aviation data into an <b>accessible, human-centric narrative</b>." },
        { title: "Tactile Tomography", category: "Exhibit", link: "artifacts/building_brains.html", audience: "General", focus: 1, scale: 4.5, date: "2024-3-01", displayDate: "March 2024", bodyText:
             "This physical exhibit translates deuterium metabolic imaging using laser-engraved brain models. It prioritizes <b>inquiry-based learning</b> by replacing abstract digital data with <b>tactile metaphors</b>." },
        { title: "Find My Mangos", category: "Exhibit", link: "artifacts/campus_board.html", audience: "General", focus: 2, scale: 4.2, date: "2024-11-01", displayDate: "Nov. 2024", bodyText:
             "This interactive LED map reimagines real-time location sharing on campus. It highlights a <b>creative response</b> to limited resolution to <b>streamline data presentation</b>." },
        { title: "Teaching Data Storytelling", category: "Infographic", link: "artifacts/teaching.html", audience: "General", focus: 1, scale: 5, date: "2026-02-01", displayDate: "Feb. 2026", bodyText: 
            "A data science homework assignment redesigned to prioritize a <b>message-first framework</b>. It teaches students the fundamentals of <b>data storytelling</b>."},
        { title: "ISMRM Presentation", category: "Presentation", link: "artifacts/ismrm_presentation.html", audience: "Specialized", focus: 3, scale: 4.2, date: "2023-09-01", displayDate: "Sep. 2023", bodyText: 
            "A digital presentation showcasing a image reconstruction algorithm. It highlights the importance of <b>clear, narrative-driven communication</b> for a <b>specialized audience</b>." },
        { title: "Decoding Coreference", category: "Paper", link: "artifacts/neural_coreference.html", audience: "Specialized", focus: 4, scale: 5, date: "2024-6-01", displayDate: "June 2024", bodyText: 
            "This project navigates a dual-audience by <b>tailoring data visualizations</b> across a technical paper and a presentation. It balances <b>technical clarity</b> with an <b>artistic, progressive reveal</b>." },
        { title: "Speaker Modeling", category: "Paper", link: "artifacts/speaker_decoding.html", audience: "Specialized", focus: 4, scale: 4.5, date: "2025-03-01", displayDate: "March 2025", bodyText:
             "A project exploring speaker identification from neural data. It displays the importance of <b>using color effectively</b> to bridge the gap between raw data and audience understanding." },
        { title: "Attention guided encoding", category: "Presentation", link: "artifacts/attention_morphology.html", audience: "Specialized", focus: 4, scale: 4.2, date: "2026-04-01", displayDate: "April 2026", bodyText: 
            "A senior thesis exploring the gap between large language models and human linguistic structures. It highlights the critical role of <b>science communication</b> in defending methodology to an <b>expert audience</b>." },
    ];

    const formatOrder = ["Paper", "Presentation", "Infographic", "Exhibit"];
    artifacts.sort((a, b) => formatOrder.indexOf(a.category) - formatOrder.indexOf(b.category));

    const container = document.getElementById('bubble-chart-container');
    if (!container) return;

    const formViewBtn = document.getElementById('form-view-btn');

    container.style.position = "relative";

    const tooltip = d3.select(container).append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none");

    let width = container.clientWidth;
    // Initial placeholder height
    let height = 300; 
    let currentView = 'generic'; 

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

    const formXScale = d3.scalePoint()
        .domain(formatOrder)
        .padding(0.5);

    const formYScale = d3.scaleLinear()
        .domain([5, 0]); // Focus 4 (Comp) at bottom to 1 (Human) at top, expanded domain squeezes items towards center

    const axisLabelFontSize = "1.1rem";

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

    // --- FORM VIEW ELEMENTS (Combined Format + Focus) ---
    const formAxisGroup = svg.append("g")
        .attr("class", "form-axis")
        .style("opacity", 0)
        .style("pointer-events", "none"); // Allow clicks to pass through labels if needed, but axis lines usually strictly visual

    const xAxisGroup = formAxisGroup.append("g")
        .attr("class", "x-axis")
        .style("font-family", '"Source Sans Pro", Helvetica, sans-serif')
        .style("font-size", "1.1rem");

    const yAxisGroup = formAxisGroup.append("g")
        .attr("class", "y-axis")
        .style("font-family", '"Source Sans Pro", Helvetica, sans-serif')
        .style("font-size", "1.1rem");

    // Labels for the axes
    const formXLabelLeft = formAxisGroup.append("text")
        .text("Less Visual")
        .attr("class", "focus-label")
        .attr("text-anchor", "start")
        .style("font-size", axisLabelFontSize)
        .style("font-weight", "bold");

    const formXLabelRight = formAxisGroup.append("text")
        .text("More Visual")
        .attr("class", "focus-label")
        .attr("text-anchor", "end")
        .style("font-size", axisLabelFontSize)
        .style("font-weight", "bold");

    // --- TIMELINE VIEW ELEMENTS ---
    const timelineAxisGroup = svg.append("g")
        .attr("class", "timeline-axis")
        .style("opacity", 0)
        .style("pointer-events", "none");

    const timelineXAxisGroup = timelineAxisGroup.append("g")
        .attr("class", "x-axis")
        .style("font-family", '"Source Sans Pro", Helvetica, sans-serif')
        .style("font-size", "1.1rem");

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
            groupNodes = artifacts.filter(item => item.category === d.category && item.focus === d.focus);
        } else if (currentView === 'timeline') {
            groupNodes = [d]; // Only highlight the specific node in timeline
        } else {
            groupNodes = artifacts.filter(item => item.category === d.category);
        }

        const minX = d3.min(groupNodes, b => b.x - b.size);
        const maxX = d3.max(groupNodes, b => b.x + b.size);

        tooltip.transition().duration(200).style("opacity", .95);
        
    if (currentView === 'form') {
        tooltip.html(`
                <h3 style="margin: 0 0 5px 0;">${d.category}</h3>
                <p style="margin: 0;">${d.bodyText}</p>
            `);
    } else if (currentView === 'timeline') {
        tooltip.html(`
                <h3 style="margin: 0 0 2px 0;">${d.title}</h3>
                <h4 style="margin: 0 0 8px 0;">${d.displayDate}</h4>
                <p style="margin: 0;">${d.bodyText}</p>
            `);
    } else if (currentView === 'generic') {
        tooltip.html(`
                <h3 style="margin: 0 0 2px 0;">${d.category}</h3>
                <h4 style="margin: 0 0 8px 0;">${d.audience} Audience</h4>
                <p style="margin: 0;">${d.bodyText}</p>
            `);
    } else { // for 'audience'
        tooltip.html(`<p style="margin: 0;">${d.bodyText}</p>`);
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
                } else if (currentView === 'timeline') {
                    return (b === d) ? 1 : 0.4;
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
                } else if (currentView === 'timeline') {
                    if (b !== d) return "#d3d3d3";
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
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const baseRadius = Math.max(width / 18, 35);
        
        if (currentView === 'form') {
            height = Math.max(width * 0.75, 750);
            artifacts.sort((a, b) => formatOrder.indexOf(a.category) - formatOrder.indexOf(b.category));

            const margin = { top: 100, right: 100, bottom: 100, left: 120 };
            
            svg.transition().duration(1000)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);

            formXScale.range([margin.left, width - margin.right]);
            formYScale.range([height - margin.bottom, margin.top]);

            // Update Axes
            xAxisGroup.attr("transform", `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(formXScale).tickFormat(""))
                .call(g => g.select(".domain").remove()); // Minimal style

            yAxisGroup.attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(formYScale)
                    .tickValues([1, 2, 3, 4, 5])
                    .tickFormat(d => {
                       if(d === 1) return "Human Focus";
                       if(d === 5) return "Computational Focus";
                       return "";
                }))
                .call(g => g.select(".domain").remove())
                .selectAll("text")
                .style("font-family", '"Source Sans Pro", Helvetica, sans-serif')
                .style("font-size", "1.1rem")
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "middle")
                .attr("x", 0)
                .attr("y", -25); // Pushes the vertical text slightly left of the axis path

            // Position Labels
            formXLabelLeft
                .attr("x", margin.left)
                .attr("y", height - 50);

            formXLabelRight
                .attr("x", width - margin.right)
                .attr("y", height - 50);
            
            simulation.force("x", d3.forceX(d => formXScale(d.category)).strength(0.8));
            simulation.force("y", d3.forceY(d => formYScale(d.focus)).strength(0.8));
            
            audienceLabels.transition().duration(500).style("opacity", 0);
            formAxisGroup.transition().duration(500).style("opacity", 1);
            timelineAxisGroup.transition().duration(500).style("opacity", 0);

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
            formAxisGroup.transition().duration(500).style("opacity", 0);
            timelineAxisGroup.transition().duration(500).style("opacity", 0);
        } else if (currentView === 'timeline') {
            height = Math.max(width * 0.3, 250);
    
            svg.transition().duration(1000)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);
    
            const dates = artifacts.map(d => new Date(d.date));
            const timeDomain = [d3.timeMonth.offset(d3.min(dates), -2), d3.timeMonth.offset(d3.max(dates), 2)];
            
            const timeScale = d3.scaleTime()
                .domain(timeDomain)
                .range([Math.max(width * 0.1, 50), Math.min(width * 0.9, width - 50)]);
    
            timelineXAxisGroup.attr("transform", `translate(0, ${height - 50})`)
                .call(d3.axisBottom(timeScale).ticks(5).tickFormat(d3.timeFormat("%b '%y")))
                .call(g => g.select(".domain").remove())
                .selectAll("text")
                .style("font-family", '"Source Sans Pro", Helvetica, sans-serif')
                .style("font-size", "1.1rem");
    
            simulation.force("x", d3.forceX(d => timeScale(new Date(d.date))).strength(0.8));
            simulation.force("y", d3.forceY(height / 2).strength(0.8));
    
            audienceLabels.transition().duration(500).style("opacity", 0);
            formAxisGroup.transition().duration(500).style("opacity", 0);
            timelineAxisGroup.transition().duration(500).style("opacity", 1);
        } else if (currentView === 'generic') {
            height = baseRadius * 7;
            artifacts.sort((a, b) => formatOrder.indexOf(a.category) - formatOrder.indexOf(b.category));
    
            svg.transition().duration(1000)
               .attr("height", height)
               .attr("viewBox", `0 0 ${width} ${height}`);
    
            const scaleLeft = width * 0.1;
            const scaleRight = width * 0.9;
            xScale.range([scaleLeft, scaleRight]);
            
            // Update forces
            simulation.force("x", d3.forceX((d, i) => xScale(i)).strength(0.5));
            simulation.force("y", d3.forceY(height / 2).strength(0.1));
            
            // Update visibility
            audienceLabels.transition().duration(500).style("opacity", 0);
            formAxisGroup.transition().duration(500).style("opacity", 0);
            timelineAxisGroup.transition().duration(500).style("opacity", 0);
        }

        simulation.nodes(artifacts);
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

    const audienceViewBtn = document.getElementById('audience-view-btn');

    const formDesc = document.getElementById('form-description');
    const formTitle = document.getElementById('form-title');
    const audienceDesc = document.getElementById('audience-description');
    const timelineDesc = document.getElementById('timeline-description');
    const timelineTitle = document.getElementById('timeline-title');
    const defaultDesc = document.getElementById('default-description');
    const timelineViewBtn = document.getElementById('timeline-view-btn');

    function updateDescription(view) {
        if (formDesc) formDesc.style.display = view === 'form' ? 'block' : 'none';
        if (formTitle) formTitle.style.display = view === 'form' ? 'block' : 'none';
        if (audienceDesc) audienceDesc.style.display = view === 'audience' ? 'block' : 'none';
        if (timelineDesc) timelineDesc.style.display = view === 'timeline' ? 'block' : 'none';
        if (timelineTitle) timelineTitle.style.display = view === 'timeline' ? 'block' : 'none';
        if (defaultDesc) defaultDesc.style.display = view === 'generic' ? 'block' : 'none';
    }

    if (formViewBtn) {
        formViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentView === 'form') {
                currentView = 'generic';
                formViewBtn.classList.remove('primary');
                updateDescription('generic');
            } else {
                currentView = 'form';
                formViewBtn.classList.add('primary');
                if (audienceViewBtn) audienceViewBtn.classList.remove('primary');
                if (timelineViewBtn) timelineViewBtn.classList.remove('primary');
                updateDescription('form');
            }
            updatePositions();
        });
    }

    if (audienceViewBtn) {
        audienceViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentView === 'audience') {
                currentView = 'generic';
                audienceViewBtn.classList.remove('primary');
                updateDescription('generic');
            } else {
                currentView = 'audience';
                audienceViewBtn.classList.add('primary');
                if (formViewBtn) formViewBtn.classList.remove('primary');
                if (timelineViewBtn) timelineViewBtn.classList.remove('primary');
                updateDescription('audience');
            }
            updatePositions();
        });
    }

    if (timelineViewBtn) {
        timelineViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentView === 'timeline') {
                currentView = 'generic';
                timelineViewBtn.classList.remove('primary');
                updateDescription('generic');
            } else {
                currentView = 'timeline';
                timelineViewBtn.classList.add('primary');
                if (formViewBtn) formViewBtn.classList.remove('primary');
                if (audienceViewBtn) audienceViewBtn.classList.remove('primary');
                updateDescription('timeline');
            }
            updatePositions();
        });
    }

    updatePositions();
});