<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('welcome');
});

Route::get('/users', function () {
    return view('welcome');
});

Route::get('/changePassword', function () {
    return view('welcome');
});

Route::get('/scenarios', function () {
    return view('welcome');
});

Route::get('/scenario/create', function () {
    return view('welcome');
});

Route::get('/scenario/edit/{id}', function () {
    return view('welcome');
});

Route::get('/questions', function () {
    return view('welcome');
});

Route::get('/question/create/{id}', function () {
    return view('welcome');
});

Route::get('/question/edit/{id}', function () {
    return view('welcome');
});

Route::get('/settings', function () {
    return view('welcome');
});

Route::get('/setting/edit/{id}', function () {
    return view('welcome');
});

Route::get('/chat', function () {
    return view('welcome');
});