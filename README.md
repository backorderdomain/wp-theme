# NYTimes-Inspired News Magazine Theme

A professional news website template inspired by The New York Times design, built with semantic HTML5, modern CSS, and vanilla JavaScript. Optimized for easy conversion to WordPress.

## 📁 Project Structure

```
wp-theme/
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       └── main.js             # Main JavaScript
├── homepage.html               # Homepage template
├── article.html                # Single article template
├── archive.html                # Category/tag archive template
├── author.html                 # Author archive template
├── search.html                 # Search results template
├── page.html                   # Static page template
├── 404.html                    # 404 error page
└── README.md                   # Documentation
```

## 🎨 Features

### Design
- Clean, professional NYTimes-inspired layout
- Serif typography for headlines (Merriweather)
- Sans-serif for body text (Open Sans)
- Responsive grid system
- Mobile-first approach

### Functionality
- Responsive navigation with mobile menu
- Search functionality
- Article sharing buttons
- Pagination
- Dynamic date display
- Smooth scrolling
- Mobile-optimized

### HTML5 Semantic Structure
- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Proper heading hierarchy
- ARIA labels for accessibility
- Schema-ready markup

## 🔄 Converting to WordPress

This template is designed for easy WordPress conversion. Here's how each file maps to WordPress templates:

### Template Mapping

| HTML File | WordPress Template | Template Name |
|-----------|-------------------|---------------|
| homepage.html | index.php or front-page.php | Main homepage |
| article.html | single.php | Single post template |
| archive.html | archive.php, category.php, tag.php | Archive pages |
| author.html | author.php | Author archive |
| search.html | search.php | Search results |
| page.html | page.php | Static pages |
| 404.html | 404.php | Error page |

### WordPress Conversion Steps

#### 1. Create Theme Structure
```
wp-content/themes/news-magazine/
├── style.css
├── functions.php
├── index.php
├── header.php
├── footer.php
├── sidebar.php
├── single.php
├── archive.php
├── author.php
├── search.php
├── page.php
├── 404.php
├── assets/
│   ├── css/
│   └── js/
└── inc/
    └── template-tags.php
```

#### 2. Split Header & Footer
Extract common header and footer sections into separate files:

**header.php**
```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Header content from HTML files -->
```

**footer.php**
```php
<!-- Footer content from HTML files -->
<?php wp_footer(); ?>
</body>
</html>
```

#### 3. WordPress Loop Integration

Replace static articles with WordPress loop:

```php
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article <?php post_class('article-card'); ?>>
        <div class="article-meta">
            <a href="<?php echo get_category_link(get_the_category()[0]->term_id); ?>" class="article-category">
                <?php echo get_the_category()[0]->name; ?>
            </a>
        </div>

        <figure class="article-thumbnail">
            <a href="<?php the_permalink(); ?>">
                <?php the_post_thumbnail('large'); ?>
            </a>
        </figure>

        <header>
            <h3 class="article-title">
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            </h3>
        </header>

        <div class="article-excerpt">
            <?php the_excerpt(); ?>
        </div>

        <div class="article-meta">
            <span class="article-author">By <a href="<?php echo get_author_posts_url(get_the_author_meta('ID')); ?>"><?php the_author(); ?></a></span>
            <span class="article-date">
                <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
            </span>
        </div>
    </article>
<?php endwhile; endif; ?>
```

#### 4. Navigation Menus

Replace static navigation with WordPress menu:

```php
<?php
wp_nav_menu(array(
    'theme_location' => 'primary',
    'menu_class' => 'nav-menu',
    'container' => false
));
?>
```

Register menus in functions.php:

```php
function news_magazine_setup() {
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'news-magazine'),
        'footer' => __('Footer Menu', 'news-magazine')
    ));

    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
}
add_action('after_setup_theme', 'news_magazine_setup');
```

#### 5. Enqueue Styles & Scripts

Create functions.php:

```php
<?php
function news_magazine_scripts() {
    // Styles
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Open+Sans:wght@400;600;700&display=swap', array(), null);
    wp_enqueue_style('news-magazine-style', get_stylesheet_uri(), array('google-fonts'), '1.0.0');

    // Scripts
    wp_enqueue_script('news-magazine-main', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'news_magazine_scripts');
```

#### 6. Custom Post Meta

Add reading time, category colors, etc.:

```php
// Reading time calculation
function news_magazine_reading_time() {
    $content = get_post_field('post_content', get_the_ID());
    $word_count = str_word_count(strip_tags($content));
    $reading_time = ceil($word_count / 200);
    return $reading_time . ' min read';
}
```

#### 7. Search Form

Replace HTML search with WordPress search:

```php
<form class="search-form" role="search" method="get" action="<?php echo home_url('/'); ?>">
    <label for="search-input" class="sr-only">Search</label>
    <input
        type="search"
        id="search-input"
        class="search-input"
        placeholder="Search..."
        name="s"
        value="<?php echo get_search_query(); ?>"
        aria-label="Search">
    <button type="submit" class="search-submit" aria-label="Submit search">
        <!-- SVG icon -->
    </button>
</form>
```

#### 8. Custom Widgets

Register sidebar areas:

```php
function news_magazine_widgets_init() {
    register_sidebar(array(
        'name' => __('Sidebar', 'news-magazine'),
        'id' => 'sidebar-1',
        'before_widget' => '<div class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
}
add_action('widgets_init', 'news_magazine_widgets_init');
```

## 📱 Responsive Breakpoints

- Desktop: 1280px+
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🎨 Color Palette

```css
--color-primary: #000;
--color-secondary: #121212;
--color-accent: #326891;
--color-border: #e2e2e2;
--color-text: #333;
--color-text-light: #666;
--color-bg: #fff;
--color-bg-light: #f7f7f7;
```

## 🔤 Typography

- Headlines: Merriweather (Serif)
- Body: Open Sans (Sans-serif)

## ✨ CSS Classes Reference

### Layout
- `.container` - Main content container (max-width: 1280px)
- `.container-narrow` - Narrow container for articles (max-width: 780px)

### Article Cards
- `.article-card` - Standard article card
- `.article-card-featured` - Large featured article
- `.article-card-small` - Small article card

### Grids
- `.articles-grid` - Article grid container
- `.articles-grid-2` - 2-column grid
- `.articles-grid-3` - 3-column grid
- `.articles-grid-4` - 4-column grid

### Utility Classes
- `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl` - Margin bottom
- `.mt-sm`, `.mt-md`, `.mt-lg`, `.mt-xl` - Margin top
- `.text-center`, `.text-left`, `.text-right` - Text alignment

## 🚀 Getting Started

1. Open `homepage.html` in your browser to view the template
2. Customize colors in `assets/css/style.css` (CSS variables section)
3. Replace placeholder images with actual images
4. Follow WordPress conversion guide above to create a theme

## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This template is free to use for personal and commercial projects.

## 👨‍💻 Credits

Design inspired by The New York Times
Built with semantic HTML5, CSS3, and vanilla JavaScript
