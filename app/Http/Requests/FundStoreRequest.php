<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class FundStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isUpdate = $this->isMethod('patch') || $this->isMethod('put');
        
        return [
            'name' => 'required|string|between:3,255',
            'iban' => 'nullable|string|min:15|max:34', // IBAN peut varier en longueur
            'description' => 'required|string|between:3,255',
            'permanent' => 'boolean',
            'amount' => $isUpdate ? 'nullable|numeric|min:0' : 'required|numeric|min:0',
        ];
    }
}
