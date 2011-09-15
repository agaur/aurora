function setBarStyles(bar, graphDef, panel) {
    bar.data(function () {
        var arr = [], i;
        for (i = 0; i < graphDef.data.length; i = i + 1) {
            arr.push(graphDef.data[i].value);
        }
        return arr;
    });
    bar.bottom(0);
    bar.width(20);
    bar.height(function (d) {
        return d * 80;
    });
    bar.left(function () {
        return this.index * 40 + 5;
    });
}

function setLabelStyles(label, data) {
    label.text(function () {
        return data[this.index].label;
    });
    label.textAngle(-Math.PI / 2);
    label.textStyle("white");
    label.textBaseline("top");
    return label;
}

function setRuleStyles(rule, config) {
    rule.data(pv.range(0, 5, 0.5)).bottom(function (d) {
        return d * 70;
    });
    rule.strokeStyle(config.color || "black");
}

function Graph(graphDef, renderDiv) {
    var styles = graphDef.styles, panel, rule, bar, label;
    panel = new pv.Panel().width(styles.width).height(styles.height);
    var caption = panel.add(pv.Label).text(graphDef.chart.caption).left(styles.width / 2).top(20).textAlign("center");
    caption.text("asdda");
    if (graphDef.rule) {
        rule = panel.add(pv.Rule);
        setRuleStyles(rule, graphDef.rule);
    }
    bar = panel.add(pv.Bar);
    setBarStyles(bar, graphDef, panel);
    label = bar.anchor("bottom").add(pv.Label);
    setLabelStyles(label, graphDef.data, bar);
    return panel;
}