<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\HtmlString;

function vite_assets(): HtmlString
{
    $devServerIsRunning = false;
    
    if (app()->environment('local')) {
        try {
            Http::get("http://localhost:5173");
            $devServerIsRunning = true;
        } catch (Exception $ex) {
        }
    }
    
    if ($devServerIsRunning) {
        return new HtmlString(<<<HTML
            <script type="module" src="http://localhost:5173/@vite/client"></script>
            <script type="module" src="http://localhost:5173/resources/js/app.js"></script>
        HTML);
    }
    
    $manifest = json_decode(file_get_contents(
        public_path('build/manifest.json')
    ), true);
    
    return new HtmlString(<<<HTML
    <script type="module" src="/build/{$manifest['resources/js/app.js']['file']}"></script>
    <link rel="stylesheet" href="/build/{$manifest['resources/js/app.js']['css'][0]}">
HTML);
}