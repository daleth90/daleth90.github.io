---
layout: default
permalink: /projects/
published: true
---

<!-- Keep some space from the header -->
<p></p>

<!-- Professional Projects -->
<h2 class="title-group">Professional Projects</h2>
<div>
  {% assign pro-projects = site.projects | where:"category","pro" | where:"card","featured" | sort:"date" | reverse%}
  {% for project in pro-projects %}
    {% capture title %}{{ project.title }}{% endcapture %}
    {% capture description %}{{ project.description }}{% endcapture %}
    {% capture image %}{{ project.image }}{% endcapture %}
    {% capture content %}{{ project.content | markdownify }}{% endcapture %}
    {% include projects/{{ project.card }}.html title=title description=description image=image content=content %}
  {% endfor %}
</div>
