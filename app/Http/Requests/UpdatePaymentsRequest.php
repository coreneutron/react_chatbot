<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentsRequest extends FormRequest
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
            'pay_date' => [
                'date',
                'required',
            ],
            'article_id' => [
                'numeric',
                'required',
            ],
            'construction_id' => [
                'numeric',
                'required',
            ],
            'company_id' => [
                'required',
                'numeric',
            ],
            'cost' => [
                'required',
                'numeric',
            ],
            'is_cash' => [
                'required',
                'numeric',
            ]
        ];
    }
}
