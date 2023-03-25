<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('settings')->insert(
            [
                [
                    'name' => 'ヘッダーのタイトル',
                    'value' => 'チャットページにようこそ',
                    'type' => 'text'
                ], 
                [
                    'name' => 'ヘッダー文章',
                    'value' => 'HP組み込みシナリオ型のチャットボットシステムです。',
                    'type' => 'text'
                ], 
                [
                    'name' => '基本色',
                    'value' => '#162f5c',
                    'type' => 'color'
                ], 
                [
                    'name' => 'Bot文字の色',
                    'value' => '#314141',
                    'type' => 'color'
                ], 
                [
                    'name' => '背景色',
                    'value' => '#ffffff',
                    'type' => 'color'
                ],
                [
                    'name' => 'icon画像',
                    'value' => 'avatar.jpg',
                    'type' => 'image'
                ]
            ]
        );
    }
}
