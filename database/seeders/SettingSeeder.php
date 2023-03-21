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
                    'value' => 'This is great chat bot!',
                    'type' => 'text'
                ], 
                [
                    'name' => 'ヘッダー文章',
                    'value' => 'I am very happy to develop this auto chat app!',
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
                ]
            ]
        );
    }
}
