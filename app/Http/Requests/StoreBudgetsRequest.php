<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'article_id' => [
                'numeric',
                'required',
            ],
            'construction_id' => [
                'numeric',
                'required',
            ],
            'contract_amount' => [
                'numeric',
                'required',
            ],
            'cost' => [
                'numeric',
                'required',
            ],
            'change_amount' => [
                'required',
                'numeric',
            ],
        ];
    }

    // public function withValidator($validator)
    // {
    //     $validator->after(function ($validator) {
    //         if ($validator->errors()) {
    //             $validator->errors()->add('field', 'Something is wrong with this field!');
    //         }
    //     });
    // }
}
